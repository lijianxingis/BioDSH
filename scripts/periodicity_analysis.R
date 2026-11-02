#!/usr/bin/env Rscript
# Detect periodic genes in a time-course expression matrix.
#
# GSE3635 samples every 10 minutes across two yeast cell cycles with a single array per
# time point. There are no replicates, so a group comparison has no variance estimate and
# limma would either refuse or invent one. The appropriate question is periodicity, and
# the appropriate method compares each gene against a sine at the cell-cycle period.
#
# The output says what was not done: this ranks genes by fit to a sinusoid. It does not
# assign cell-cycle phases to samples and it does not interpret biology.

suppressPackageStartupMessages({ library(limma) })

args <- commandArgs(trailingOnly = TRUE)
exprPath <- if (length(args) >= 1) args[1] else "expression.csv"
metaPath <- if (length(args) >= 2) args[2] else "samples.csv"
outputPath <- if (length(args) >= 3) args[3] else "periodic-genes.csv"
summaryPath <- if (length(args) >= 4) args[4] else "periodicity-summary.json"
periodMinutes <- if (length(args) >= 5) as.numeric(args[5]) else NA

for (path in c(exprPath, metaPath)) {
  if (!file.exists(path)) {
    cat(sprintf("missing input: %s\n", path), file = stderr())
    quit(status = 1)
  }
}

expr <- as.matrix(read.csv(exprPath, row.names = 1, check.names = FALSE))
meta <- read.csv(metaPath, stringsAsFactors = FALSE)

if (ncol(expr) != nrow(meta)) {
  cat(sprintf("matrix has %d columns but the sheet has %d rows\n", ncol(expr), nrow(meta)), file = stderr())
  quit(status = 1)
}

# Recover the time axis. GSE3635 encodes it in the sample title as "time point N min".
times <- suppressWarnings(as.numeric(sub(".*time point ([0-9]+) min.*", "\\1", meta$title)))
if (all(is.na(times))) {
  # Fall back to position, but say so in the output rather than pretending.
  times <- seq(0, by = 1, length.out = ncol(expr))
  timeSource <- "sample-order"
} else {
  if (any(is.na(times))) {
    cat("some sample titles carry no time point; refusing a partial axis\n", file = stderr())
    quit(status = 1)
  }
  timeSource <- "sample-title"
}

if (length(unique(times)) != length(times)) {
  cat("the time axis has duplicate time points; periodicity needs one sample per time\n", file = stderr())
  quit(status = 1)
}
if (length(times) < 6) {
  cat(sprintf("only %d time points: too few to fit a cycle\n", length(times)), file = stderr())
  quit(status = 1)
}

span <- max(times) - min(times)
period <- if (!is.na(periodMinutes)) periodMinutes else span / 2
if (period <= 0) {
  cat("the derived period is not positive\n", file = stderr())
  quit(status = 1)
}

# Two cycles over the sampled span is the design; a fit at any other period would be a
# different claim, so the period used is reported.
omega <- 2 * pi / period

fitOne <- function(y) {
  ok <- is.finite(y)
  if (sum(ok) < 6) return(c(amplitude = NA, phase = NA, r2 = NA, pvalue = NA))
  t <- times[ok]
  yy <- y[ok]
  design <- cbind(intercept = 1, sin = sin(omega * t), cos = cos(omega * t))
  fit <- lm.fit(design, yy)
  coefs <- fit$coefficients
  if (any(is.na(coefs))) return(c(amplitude = NA, phase = NA, r2 = NA, pvalue = NA))
  fitted <- design %*% coefs
  rss <- sum((yy - fitted)^2)
  tss <- sum((yy - mean(yy))^2)
  r2 <- if (tss > 0) 1 - rss / tss else 0
  # F test against the intercept-only model: 2 extra terms, n-3 residual df.
  dfResid <- length(yy) - 3
  if (dfResid <= 0) return(c(amplitude = NA, phase = NA, r2 = r2, pvalue = NA))
  fstat <- ((tss - rss) / 2) / (rss / dfResid)
  pvalue <- if (is.finite(fstat) && fstat > 0) pf(fstat, 2, dfResid, lower.tail = FALSE) else NA
  amplitude <- sqrt(coefs[["sin"]]^2 + coefs[["cos"]]^2)
  phase <- atan2(coefs[["cos"]], coefs[["sin"]])
  c(amplitude = amplitude, phase = phase, r2 = r2, pvalue = pvalue)
}

results <- t(apply(expr, 1, fitOne))
padj <- p.adjust(results[, "pvalue"], method = "BH")

table <- data.frame(
  probe = rownames(expr),
  amplitude = results[, "amplitude"],
  phaseRadians = results[, "phase"],
  rSquared = results[, "r2"],
  pvalue = results[, "pvalue"],
  adjP = padj,
  stringsAsFactors = FALSE
)
table <- table[order(table$pvalue, na.last = TRUE), ]
write.csv(table, outputPath, row.names = FALSE)

alpha <- 0.05
significant <- sum(table$adjP < alpha, na.rm = TRUE)
fmt <- function(x) if (is.na(x)) "null" else format(x, digits = 10)
payload <- paste0(
  '{"schemaVersion":1,',
  '"probesTested":', nrow(table), ',',
  '"timePoints":', length(times), ',',
  '"spanMinutes":', span, ',',
  '"periodMinutes":', period, ',',
  '"timeAxisSource":"', timeSource, '",',
  '"method":"sine fit at the stated period, F test, BH correction",',
  '"replicates":0,',
  '"significantAtFdr05":', significant, ',',
  '"topHit":{',
  '"probe":"', table$probe[1], '",',
  '"rSquared":', fmt(table$rSquared[1]), ',',
  '"adjP":', fmt(table$adjP[1]), '},',
  '"limmaVersion":"', as.character(packageVersion("limma")), '",',
  '"rVersion":"', as.character(getRversion()), '",',
  '"notPerformed":["phase assignment for samples","biological interpretation","comparison against known cycling gene sets"],',
  '"biologicalInterpretation":"not-performed"}'
)
writeLines(payload, summaryPath)

cat(sprintf("probes=%d timepoints=%d period=%gmin significant=%d\n", nrow(table), length(times), period, significant))

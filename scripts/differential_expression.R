#!/usr/bin/env Rscript
# Differential expression with limma, for a two-group comparison.
#
# Reads a matrix of counts (genes x samples) and a sample sheet, fits a linear model,
# and writes the ranked result. Empirically-Bayes moderated t-statistics, which is what
# limma is for: with few replicates a plain t-test has almost no power.

suppressPackageStartupMessages({
  library(limma)
  library(edgeR)
})

args <- commandArgs(trailingOnly = TRUE)
countsPath <- if (length(args) >= 1) args[1] else "counts.csv"
samplesPath <- if (length(args) >= 2) args[2] else "samples.csv"
outputPath <- if (length(args) >= 3) args[3] else "de-results.csv"
summaryPath <- if (length(args) >= 4) args[4] else "de-summary.json"

for (path in c(countsPath, samplesPath)) {
  if (!file.exists(path)) {
    cat(sprintf("missing input: %s\n", path), file = stderr())
    quit(status = 1)
  }
}

counts <- as.matrix(read.csv(countsPath, row.names = 1, check.names = FALSE))
samples <- read.csv(samplesPath, stringsAsFactors = FALSE)

if (!all(c("sample", "group") %in% names(samples))) {
  cat("the sample sheet needs columns named sample and group\n", file = stderr())
  quit(status = 1)
}
if (ncol(counts) != nrow(samples)) {
  cat(sprintf("counts has %d columns but the sheet has %d rows\n", ncol(counts), nrow(samples)), file = stderr())
  quit(status = 1)
}
if (!identical(colnames(counts), as.character(samples$sample))) {
  cat("the count columns must match the sample column, in order\n", file = stderr())
  quit(status = 1)
}

groups <- factor(samples$group)
if (nlevels(groups) != 2) {
  cat(sprintf("expected 2 groups, found %d\n", nlevels(groups)), file = stderr())
  quit(status = 1)
}
if (any(table(groups) < 2)) {
  cat("each group needs at least 2 samples for a variance estimate\n", file = stderr())
  quit(status = 1)
}

design <- model.matrix(~ 0 + groups)
colnames(design) <- levels(groups)
contrast <- makeContrasts(contrasts = paste0(levels(groups)[2], "-", levels(groups)[1]), levels = design)

# TMM normalisation: without it, library-size differences masquerade as signal.
dge <- DGEList(counts = counts, group = groups)
dge <- calcNormFactors(dge)

# Filtering is a real decision, so the number removed is reported rather than hidden.
keep <- filterByExpr(dge, design)
removed <- sum(!keep)
dge <- dge[keep, , keep.lib.sizes = FALSE]

v <- voom(dge, design, plot = FALSE)
fit <- lmFit(v, design)
fit <- contrasts.fit(fit, contrast)
fit <- eBayes(fit)

table <- topTable(fit, number = Inf, sort.by = "P")
table$gene <- rownames(table)
write.csv(table, outputPath, row.names = FALSE)

# A fixed threshold is a reporting convention, not a finding; the summary says which.
alpha <- 0.05
lfc <- 1
significant <- subset(table, adj.P.Val < alpha & abs(logFC) >= lfc)

fmt <- function(x) format(x, digits = 10)
payload <- paste0(
  '{"schemaVersion":1,',
  '"genesTested":', nrow(table), ',',
  '"genesFilteredOut":', removed, ',',
  '"samplesPerGroup":', paste0('{', paste(sprintf('"%s":%d', names(table(groups)), as.integer(table(groups))), collapse = ","), '}'), ',',
  '"normalisation":"TMM",',
  '"model":"limma-trend via voom, eBayes",',
  '"thresholds":{"adjP":', alpha, ',"logFC":', lfc, '},',
  '"significant":', nrow(significant), ',',
  '"limmaVersion":"', as.character(packageVersion("limma")), '",',
  '"edgeRVersion":"', as.character(packageVersion("edgeR")), '",',
  '"rVersion":"', as.character(getRversion()), '",',
  '"biologicalInterpretation":"not-performed"',
  '}'
)
writeLines(payload, summaryPath)

cat(sprintf("tested=%d filtered=%d significant=%d\n", nrow(table), removed, nrow(significant)))

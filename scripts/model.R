#!/usr/bin/env Rscript
# A real analysis step: fit a linear model, report coefficients, and write an artifact.
# Base R only, so it runs with --network none and no package installation.

args <- commandArgs(trailingOnly = TRUE)
input <- if (length(args) >= 1) args[1] else "expression.csv"
output <- if (length(args) >= 2) args[2] else "model-result.json"

if (!file.exists(input)) {
  cat(sprintf("missing input: %s\n", input), file = stderr())
  quit(status = 1)
}

data <- read.csv(input, stringsAsFactors = FALSE)
if (nrow(data) < 3) {
  cat(sprintf("too few rows to fit: %d\n", nrow(data)), file = stderr())
  quit(status = 1)
}
if (!all(c("expression", "group") %in% names(data))) {
  cat("input needs columns named expression and group\n", file = stderr())
  quit(status = 1)
}

fit <- lm(expression ~ group, data = data)
coefficients <- coef(fit)
summary_fit <- summary(fit)

# toJSON by hand: jsonlite would need an install, and this shape is small.
escape <- function(x) gsub('"', '\\"', as.character(x))
pairs <- paste0('"', escape(names(coefficients)), '":', format(coefficients, digits = 10), collapse = ",")
payload <- paste0(
  '{"schemaVersion":1,',
  '"rows":', nrow(data), ',',
  '"groups":', length(unique(data$group)), ',',
  '"coefficients":{', pairs, '},',
  '"rSquared":', format(summary_fit$r.squared, digits = 10), ',',
  '"residualStdError":', format(summary_fit$sigma, digits = 10), ',',
  '"rVersion":"', R.version.string, '",',
  '"interpretation":"not-performed"',
  '}'
)
writeLines(payload, output)
cat(sprintf("rows=%d groups=%d r2=%s\n", nrow(data), length(unique(data$group)), format(summary_fit$r.squared, digits = 4)))

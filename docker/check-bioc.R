# Fail the build if the packages are not actually importable. An image that claims a
# toolchain it cannot load is worse than one that fails to build.
suppressPackageStartupMessages({
  library(limma)
  library(edgeR)
})
cat("limma", as.character(packageVersion("limma")), "\n")
cat("edgeR", as.character(packageVersion("edgeR")), "\n")
cat("R", as.character(getRversion()), "\n")

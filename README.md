# Sentinel Hub 🛸

> **The Zero-Budget, Serverless Modular Neural Architecture Registry for Sentinel**

`sentinel-hub` is the open community registry of composable neural network components, compound blocks, and declarative templates for the [Sentinel](https://github.com/rimraf-adi/sentinel) ML supervisor.

It operates on a **100% zero-budget, serverless distribution model**: all modules are served directly over public multi-CDN edge nodes (Fastly / Cloudflare / GitHub Raw / jsDelivr) with zero infrastructure overhead.

---

## ⚡ Instant CLI Installation

Install any module directly into your Sentinel project workspace:

```bash
# Vision Transformer
sentinel add --module vit-tiny

# Semantic Segmentation U-Net
sentinel add --module unet

# Residual Network
sentinel add --module resnet-mini

# Kolmogorov-Arnold Network (KAN)
sentinel add --module kan-linear

# State Space Model (Mamba)
sentinel add --module mamba-ssm
```

To install globally into your user template library (`~/.sentinel/templates/`):

```bash
sentinel add --module vit-tiny --global
```

---

## 📦 Available Modules

| Module ID | Domain | Architecture Name | Highlights |
| :--- | :--- | :--- | :--- |
| `vit-tiny` | Vision | Vision Transformer Tiny | Patch embedding, CLS token, Transformer blocks |
| `unet` | Vision | U-Net | Textbook U-shape, symmetric skip concatenations |
| `resnet-mini` | Vision | ResNet Mini | Identity bypass skip connections |
| `cnn-classifier` | Vision | CNN Classifier | Convolutions, BatchNorm, Pooling |
| `transformer-classifier` | Sequence | Transformer Classifier | Multi-head self-attention |
| `lstm-classifier` | Sequence | LSTM Classifier | Recurrent temporal modeling |
| `residual-mlp` | Tabular | Residual MLP | Deep tabular residual layers |
| `deep-residual-mlp` | Tabular | Deep Residual MLP | Multi-stage residual tabular blocks |
| `ann-classifier` | Tabular | ANN Classifier | Baseline feed-forward network |
| `vae` | Generative | Variational Autoencoder | Gaussian latent reparameterization |
| `gan` | Generative | Generative Adversarial Network | Generator and Discriminator DAGs |
| `gcn-classifier` | Graph | Graph Convolutional Network | Spectral node/graph convolutions |
| `kan-linear` | Experimental | KAN Linear Classifier | Learnable spline activation functions |
| `mamba-ssm` | Experimental | Mamba SSM Classifier | Linear time complexity in sequence length |

---

## 🚀 How to Contribute a Module

1. Fork this repository.
2. Create your declarative component YAML in `modules/<domain>/<name>.yaml`.
3. Add your module metadata entry to `registry.json`.
4. Submit a Pull Request. Once merged, your module is instantly available worldwide to all Sentinel users!

---

## 🛡️ Security & Zero-Execution Guarantee

All modules in `sentinel-hub` are strictly declarative YAML graph specifications (`schema_version: "1.0"`). They contain **zero executable Python code or binary blobs**, making installation completely safe against supply chain attack vectors.

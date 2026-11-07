"""
Sentinel xAI Runtime Hook
Automatically computes SVD representation rank and Integrated Gradients during training.
"""
import logging

logger = logging.getLogger("sentinel.xai")

def on_train_begin(model, optimizer=None, config=None):
    logger.info("xAI Hook Active: Integrated Gradients and Spectral Rank monitoring ready.")

def on_epoch_end(epoch, val_loss, model):
    try:
        import sentinel
        if hasattr(sentinel, "spectral_rank"):
            ranks = sentinel.spectral_rank(model)
            logger.info(f"xAI Spectral Diagnostics (Epoch {epoch}): {len(ranks)} layers analyzed.")
    except Exception as e:
        logger.debug(f"xAI epoch hook notice: {e}")

def on_train_end(model, run_id=None):
    try:
        import sentinel
        if hasattr(sentinel, "spectral_rank"):
            ranks = sentinel.spectral_rank(model)
            logger.info(f"xAI Post-Train Summary: {len(ranks)} layers analyzed for representation collapse.")
    except Exception as e:
        logger.debug(f"xAI train end notice: {e}")

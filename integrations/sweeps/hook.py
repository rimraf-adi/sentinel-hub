"""
Sentinel Sweeps Runtime Hook
Reports intermediate validation metrics to Optuna ASHA pruner.
"""
import logging

logger = logging.getLogger("sentinel.sweeps")

def on_step_end(step, loss, model=None, **kwargs):
    pass

def on_epoch_end(epoch, val_loss, model=None, trial=None, **kwargs):
    if trial is not None:
        try:
            trial.report(val_loss, step=epoch)
            if trial.should_prune():
                logger.info(f"ASHA Pruner: Trial {trial.number} pruned at epoch {epoch} (val_loss={val_loss:.4f})")
                import optuna
                raise optuna.TrialPruned()
        except Exception as e:
            if "TrialPruned" in str(type(e)):
                raise
            logger.debug(f"Sweeps report notice: {e}")

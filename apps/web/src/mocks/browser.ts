import { setupWorker } from 'msw/browser'
import { warehouseHandlers } from './handlers/warehouse'
import { cuttingHandlers } from './handlers/cutting'
import { sewingHandlers } from './handlers/sewing'
import { qualityHandlers } from './handlers/quality'
import { finishingHandlers } from './handlers/finishing'
import { analyticsHandlers } from './handlers/analytics'
import { adminHandlers } from './handlers/admin'

export const worker = setupWorker(
  ...warehouseHandlers,
  ...cuttingHandlers,
  ...sewingHandlers,
  ...qualityHandlers,
  ...finishingHandlers,
  ...analyticsHandlers,
  ...adminHandlers,
)

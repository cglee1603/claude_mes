import { Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'

// Warehouse
import { HWH01Page } from './pages/warehouse/H-WH-01-FabricReceive'
import { HWH02Page } from './pages/warehouse/H-WH-02-TrimReceive'
import { HWH03Page } from './pages/warehouse/H-WH-03-IssueVoucher'
import { HWH04Page } from './pages/warehouse/H-WH-04-Inventory'
import { HWH05Page } from './pages/warehouse/H-WH-05-Relaxation'
import { HPrint01Page } from './pages/warehouse/H-PRINT-01-RollLabel'
import { HPrint02Page } from './pages/warehouse/H-PRINT-02-BundleLabel'

// Cutting
import { HSC01Page } from './pages/cutting/H-SC-01-CuttingPlan'
import { HSC02Page } from './pages/cutting/H-SC-02-SpreadingReport'
import { HSC03Page } from './pages/cutting/H-SC-03-MarkerEfficiency'
import { HLot01Page } from './pages/cutting/H-LOT-01-ColorGroup'
import { HLot02Page } from './pages/cutting/H-LOT-02-LineDelivery'
import { HScan01Page } from './pages/cutting/H-SCAN-01-BundleScan'
import { HCut04Page } from './pages/cutting/H-CUT-04-Outsource'
import { HCut05Page } from './pages/cutting/H-CUT-05-DailyReport'

// Sewing
import { HSW01Page } from './pages/sewing/H-SW-01-ProductionPlan'
import { HSW02Page } from './pages/sewing/H-SW-02-PPChecklist'
import { HSW03Page } from './pages/sewing/H-SW-03-MaterialReceiving'
import { HRT01Page } from './pages/sewing/H-RT-01-ProductionOutput'
import { HBoard01Page } from './pages/sewing/H-BOARD-01-Scoreboard'
import { HQC01Page } from './pages/sewing/H-QC-01-BundleQC'
import { HQC02Page } from './pages/sewing/H-QC-02-EndlineQC'
import { HQC03Page } from './pages/sewing/H-QC-03-QCDashboard'
import { HMFZ01Page } from './pages/sewing/H-MFZ-01-MetalDetection'
import { HSW04Page } from './pages/sewing/H-SW-04-SharpTools'
import { HSW05Page } from './pages/sewing/H-SW-05-PassedGarments'
import { HSW06Page } from './pages/sewing/H-SW-06-InternalTransfer'
import { HSW07Page } from './pages/sewing/H-SW-07-HourlyEntry'

// Finishing
import { HFin01Page } from './pages/finishing/H-FIN-01-HangtagInspect'
import { HFin02Page } from './pages/finishing/H-FIN-02-MFZCalibration'
import { HFin03Page } from './pages/finishing/H-FIN-03-WeightQtyInspect'
import { HFin04Page } from './pages/finishing/H-FIN-04-CartonInspect'
import { HFin05Page } from './pages/finishing/H-FIN-05-PackingList'
import { HPerf01Page } from './pages/finishing/H-PERF-01-FinishingPerf'
import { HFin06Page } from './pages/finishing/H-FIN-06-Shipment'
import { HFin07Page } from './pages/finishing/H-FIN-07-DryRoomCheck'
import { HFin08Page } from './pages/finishing/H-FIN-08-MFZDailySummary'
import { HFin09Page } from './pages/finishing/H-FIN-09-MonthlyReport'

// Admin
import { AdminLinePage } from './pages/admin/AdminLine'
import { AdminMachinePage } from './pages/admin/AdminMachine'
import { AdminSMVPage } from './pages/admin/AdminSMV'
import { AdminERPPage } from './pages/admin/AdminERP'
import { AdminLifecyclePage } from './pages/admin/AdminLifecycle'
import { AdminQCConfigPage } from './pages/admin/AdminQCConfig'
import { AdminPermissionPage } from './pages/admin/AdminPermission'
import { AdminBackupPage } from './pages/admin/AdminBackup'

// Personal
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { MyPage } from './pages/mypage/MyPage'
import { MyMenuPage } from './pages/my-menu/MyMenuPage'
import { WorkspacePage } from './pages/my-menu/WorkspacePage'
import { MyMenuProvider } from './context/MyMenuContext'
import { FavoritesProvider } from './context/FavoritesContext'

export default function App() {
  return (
    <FavoritesProvider>
    <MyMenuProvider>
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Warehouse */}
        <Route path="warehouse">
          <Route index element={<Navigate to="fabric-receive" replace />} />
          <Route path="fabric-receive"  element={<HWH01Page />} />
          <Route path="trim-receive"    element={<HWH02Page />} />
          <Route path="issue-voucher"   element={<HWH03Page />} />
          <Route path="inventory"       element={<HWH04Page />} />
          <Route path="relaxation"      element={<HWH05Page />} />
          <Route path="roll-label"      element={<HPrint01Page />} />
          <Route path="bundle-label"    element={<HPrint02Page />} />
        </Route>

        {/* Cutting */}
        <Route path="cutting">
          <Route index element={<Navigate to="cutting-plan" replace />} />
          <Route path="cutting-plan"  element={<HSC01Page />} />
          <Route path="spreading"     element={<HSC02Page />} />
          <Route path="marker"        element={<HSC03Page />} />
          <Route path="color-group"   element={<HLot01Page />} />
          <Route path="line-delivery" element={<HLot02Page />} />
          <Route path="bundle-scan"   element={<HScan01Page />} />
          <Route path="outsource"     element={<HCut04Page />} />
          <Route path="daily-report"  element={<HCut05Page />} />
        </Route>

        {/* Sewing */}
        <Route path="sewing">
          <Route index element={<Navigate to="output" replace />} />
          <Route path="production-plan"    element={<HSW01Page />} />
          <Route path="pp-checklist"       element={<HSW02Page />} />
          <Route path="material-receiving" element={<HSW03Page />} />
          <Route path="output"             element={<HRT01Page />} />
          <Route path="bundle-qc"          element={<HQC01Page />} />
          <Route path="endline-qc"         element={<HQC02Page />} />
          <Route path="qc-dashboard"       element={<HQC03Page />} />
          <Route path="metal-detection"    element={<HMFZ01Page />} />
          <Route path="sharp-tools"        element={<HSW04Page />} />
          <Route path="passed-garments"    element={<HSW05Page />} />
          <Route path="internal-transfer"  element={<HSW06Page />} />
          <Route path="hourly-entry"       element={<HSW07Page />} />
          <Route path="scoreboard"         element={<HBoard01Page />} />
        </Route>

        {/* Finishing */}
        <Route path="finishing">
          <Route index element={<Navigate to="shipment" replace />} />
          <Route path="hangtag-inspect"  element={<HFin01Page />} />
          <Route path="mfz-calibration"  element={<HFin02Page />} />
          <Route path="weight-inspect"   element={<HFin03Page />} />
          <Route path="carton-inspect"   element={<HFin04Page />} />
          <Route path="packing-list"     element={<HFin05Page />} />
          <Route path="performance"      element={<HPerf01Page />} />
          <Route path="shipment"         element={<HFin06Page />} />
          <Route path="dry-room"         element={<HFin07Page />} />
          <Route path="mfz-summary"      element={<HFin08Page />} />
          <Route path="monthly-report"   element={<HFin09Page />} />
        </Route>

        {/* Admin */}
        <Route path="admin">
          <Route index element={<Navigate to="line" replace />} />
          <Route path="line"       element={<AdminLinePage />} />
          <Route path="machine"    element={<AdminMachinePage />} />
          <Route path="smv"        element={<AdminSMVPage />} />
          <Route path="erp"        element={<AdminERPPage />} />
          <Route path="lifecycle"  element={<AdminLifecyclePage />} />
          <Route path="qc-config"  element={<AdminQCConfigPage />} />
          <Route path="permission" element={<AdminPermissionPage />} />
          <Route path="backup"     element={<AdminBackupPage />} />
        </Route>

        {/* Personal */}
        <Route path="dashboard"     element={<DashboardPage />} />
        <Route path="mypage"        element={<MyPage />} />
        <Route path="my-menu"       element={<MyMenuPage />} />
        <Route path="my-menu/:id"   element={<WorkspacePage />} />
      </Route>
    </Routes>
    </MyMenuProvider>
    </FavoritesProvider>
  )
}

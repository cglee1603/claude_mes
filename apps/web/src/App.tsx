import { Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'

// Warehouse
import { WH01ReceivePage } from './pages/warehouse/WH01-Receive'
import { WH02HistoryPage } from './pages/warehouse/WH02-History'
import { WH03DashboardPage } from './pages/warehouse/WH03-Dashboard'

// Relaxation
import { RX04PlanPage } from './pages/relaxation/RX04-Plan'
import { RX05MaterialPage } from './pages/relaxation/RX05-Material'
import { RX06AlertPage } from './pages/relaxation/RX06-Alert'

// Cutting
import { SC07LotCreatePage } from './pages/cutting/SC07-LotCreate'
import { SC08BundleCreatePage } from './pages/cutting/SC08-BundleCreate'
import { SC09MarkerEfficiencyPage } from './pages/cutting/SC09-MarkerEfficiency'
import { SC10LotListPage } from './pages/cutting/SC10-LotList'
import { SC11LotTracePage } from './pages/cutting/SC11-LotTrace'
import { SC12ShadingCheckPage } from './pages/cutting/SC12-ShadingCheck'
import { SC13CuttingDashboardPage } from './pages/cutting/SC13-CuttingDashboard'

// Sewing
import { SW14InputPlanPage } from './pages/sewing/SW14-InputPlan'
import { SW15LineLayoutPage } from './pages/sewing/SW15-LineLayout'
import { SW16MachineStatusPage } from './pages/sewing/SW16-MachineStatus'
import { SW17OutputEntryPage } from './pages/sewing/SW17-OutputEntry'
import { SW18OutputSummaryPage } from './pages/sewing/SW18-OutputSummary'

// Quality
import { QC25InlineInspectPage } from './pages/quality/QC25-InlineInspect'
import { QC26InlineResultPage } from './pages/quality/QC26-InlineResult'
import { QC27FinalInspectPage } from './pages/quality/QC27-FinalInspect'
import { QC28FinalResultPage } from './pages/quality/QC28-FinalResult'
import { QC29PackingInspectPage } from './pages/quality/QC29-PackingInspect'
import { QC30ShippingInspectPage } from './pages/quality/QC30-ShippingInspect'
import { QC31DHUTrendPage } from './pages/quality/QC31-DHUTrend'
import { QC32QCDashboardPage } from './pages/quality/QC32-QCDashboard'

// Finishing
import { FP19TaggingPage } from './pages/finishing/FP19-Tagging'
import { FP20PolybagPage } from './pages/finishing/FP20-Polybag'
import { FP21MFZPage } from './pages/finishing/FP21-MFZ'
import { FP22CartonPage } from './pages/finishing/FP22-Carton'

// Analytics
import { AD23KPIPage } from './pages/analytics/AD23-KPI'
import { AD24WIPPage } from './pages/analytics/AD24-WIP'

// Admin
import { AdminLinePage } from './pages/admin/AdminLine'
import { AdminMachinePage } from './pages/admin/AdminMachine'
import { AdminSMVPage } from './pages/admin/AdminSMV'
import { AdminERPPage } from './pages/admin/AdminERP'
import { AdminLifecyclePage } from './pages/admin/AdminLifecycle'
import { AdminQCConfigPage } from './pages/admin/AdminQCConfig'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/analytics/kpi" replace />} />

        {/* Warehouse */}
        <Route path="warehouse">
          <Route index element={<Navigate to="receive" replace />} />
          <Route path="receive" element={<WH01ReceivePage />} />
          <Route path="history" element={<WH02HistoryPage />} />
          <Route path="dashboard" element={<WH03DashboardPage />} />
        </Route>

        {/* Relaxation */}
        <Route path="relaxation">
          <Route index element={<Navigate to="plan" replace />} />
          <Route path="plan" element={<RX04PlanPage />} />
          <Route path="material" element={<RX05MaterialPage />} />
          <Route path="alert" element={<RX06AlertPage />} />
        </Route>

        {/* Cutting */}
        <Route path="cutting">
          <Route index element={<Navigate to="lot-list" replace />} />
          <Route path="lot-create" element={<SC07LotCreatePage />} />
          <Route path="bundle-create" element={<SC08BundleCreatePage />} />
          <Route path="marker" element={<SC09MarkerEfficiencyPage />} />
          <Route path="lot-list" element={<SC10LotListPage />} />
          <Route path="lot-trace" element={<SC11LotTracePage />} />
          <Route path="shading" element={<SC12ShadingCheckPage />} />
          <Route path="dashboard" element={<SC13CuttingDashboardPage />} />
        </Route>

        {/* Sewing */}
        <Route path="sewing">
          <Route index element={<Navigate to="plan" replace />} />
          <Route path="plan" element={<SW14InputPlanPage />} />
          <Route path="layout" element={<SW15LineLayoutPage />} />
          <Route path="machine" element={<SW16MachineStatusPage />} />
          <Route path="output" element={<SW17OutputEntryPage />} />
          <Route path="summary" element={<SW18OutputSummaryPage />} />
        </Route>

        {/* Quality */}
        <Route path="quality">
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="inline-inspect" element={<QC25InlineInspectPage />} />
          <Route path="inline-result" element={<QC26InlineResultPage />} />
          <Route path="final-inspect" element={<QC27FinalInspectPage />} />
          <Route path="final-result" element={<QC28FinalResultPage />} />
          <Route path="packing-inspect" element={<QC29PackingInspectPage />} />
          <Route path="shipping-inspect" element={<QC30ShippingInspectPage />} />
          <Route path="dhu-trend" element={<QC31DHUTrendPage />} />
          <Route path="dashboard" element={<QC32QCDashboardPage />} />
        </Route>

        {/* Finishing */}
        <Route path="finishing">
          <Route index element={<Navigate to="tag" replace />} />
          <Route path="tag" element={<FP19TaggingPage />} />
          <Route path="polybag" element={<FP20PolybagPage />} />
          <Route path="mfz" element={<FP21MFZPage />} />
          <Route path="carton" element={<FP22CartonPage />} />
        </Route>

        {/* Analytics */}
        <Route path="analytics">
          <Route index element={<Navigate to="kpi" replace />} />
          <Route path="kpi" element={<AD23KPIPage />} />
          <Route path="wip" element={<AD24WIPPage />} />
        </Route>

        {/* Admin */}
        <Route path="admin">
          <Route index element={<Navigate to="line" replace />} />
          <Route path="line" element={<AdminLinePage />} />
          <Route path="machine" element={<AdminMachinePage />} />
          <Route path="smv" element={<AdminSMVPage />} />
          <Route path="erp" element={<AdminERPPage />} />
          <Route path="lifecycle" element={<AdminLifecyclePage />} />
          <Route path="qc-config" element={<AdminQCConfigPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

import React, { lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import PageLoading from "@/components/PageLoading/PageLoading";

const Home = lazy(() => import("../views/Home/Home"));

// 合同解析
const TaskBrowse = lazy(() => import("../views/ContractParse/TaskBrowse/TaskBrowse"));
const CreateTemplate = lazy(() => import("../views/ContractParse/CreateTemplate/CreateTemplate"));
const TaskReview = lazy(() => import("../views/ContractParse/TaskReview/TaskReview"));
const FiledMapping = lazy(() => import("../views/ContractParse/FiledMapping/FiledMapping"));

// 文档审核
const SingleDocumentReview = lazy(() => {
  return import("../views/DocumentReview/SingleDocumentReview/SingleDocumentReview/");
});
const MultiDocumentContrast = lazy(() => {
  return import("../views/DocumentReview/MultiDocumentContrast/MultiDocumentContrast");
});
const MultiDocumentReview = lazy(() => {
  return import("../views/DocumentReview/MultiDocumentReview/MultiDocumentReview");
});

// pdf解析
const PDFParse = lazy(() => import("../views/PDFParse/PDFParse"));
const UploadPdf = lazy(() => import("../views/PDFParse/UploadPdf/UploadPdf"));

// 视频切割
const VideoCutting = lazy(() => import("../views/VideoCutting/VideoCutting"));
const VideoDesc = lazy(() => import("../views/VideoDesc/VideoDesc"));

// 年报分析
const ArPdfView = lazy(() => import("../views/AnnualReportAnalysis/ArPdfView/ArPdfView"));
const ArWordView = lazy(() => import("../views/AnnualReportAnalysis/ArWordView/ArWordView"));

// 智能训练助理
const SmartTrainingAssistant = lazy(() =>
  import("../views/SmartTrainingAssistant/SmartTrainingAssistant")
);

function PageRouter() {
  return (
    <Suspense fallback={<PageLoading height="100%" />}>
      <Switch>
        <Route path="/home" exact component={Home} />
        <Route path="/contract_parse/task_browse" component={TaskBrowse} />
        <Route path="/contract_parse/create_template" component={CreateTemplate} />
        <Route path="/contract_parse/task_review" component={TaskReview} />
        <Route path="/contract_parse/filed_mapping" component={FiledMapping} />
        <Route path="/document_review/single_document_review" component={SingleDocumentReview} />
        <Route path="/document_review/multi_document_contrast" component={MultiDocumentContrast} />
        <Route path="/document_review/multi_document_review" component={MultiDocumentReview} />
        <Route path="/pdf_parse" component={PDFParse} />
        <Route path="/upload_pdf" component={UploadPdf} />
        <Route path="/video_cutting" component={VideoCutting} />
        <Route path="/video_desc" component={VideoDesc} />
        <Route path="/ar_pdf_view" component={ArPdfView} />
        <Route path="/ar_word_view" component={ArWordView} />
        <Route path="/smart_training_assistant" component={SmartTrainingAssistant} />
        {/* <Route path="/" exact render={() => <Redirect to="/home" />} /> */}
        <Route path="/" exact render={() => <Redirect to="/contract_parse/task_browse" />} />
      </Switch>
    </Suspense>
  );
}

export default PageRouter;

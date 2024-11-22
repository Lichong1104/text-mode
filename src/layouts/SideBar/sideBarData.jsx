import {
  BankOutlined,
  FileSyncOutlined,
  FolderViewOutlined,
  MenuOutlined,
  InsertRowBelowOutlined,
  SolutionOutlined,
  MergeCellsOutlined,
  FileSearchOutlined,
  OneToOneOutlined,
  FilePptOutlined,
  RotateLeftOutlined,
  SplitCellsOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";

export const sideBarList = [
  // { key: "/home", label: "主页", icon: <BankOutlined />, level: 1 },
  {
    key: "/contract_parse",
    label: "合同解析",
    icon: <FileSyncOutlined />,
    level: 1,
    children: [
      {
        key: "/contract_parse/task_browse",
        label: "任务浏览",
        icon: <InsertRowBelowOutlined />,
        level: 2,
      },
      {
        key: "/contract_parse/create_template",
        label: "新建模板",
        icon: <MenuOutlined />,
        level: 2,
      },
      {
        key: "/contract_parse/task_review",
        label: "任务审核",
        icon: <FolderViewOutlined />,
        level: 2,
      },
      {
        key: "/contract_parse/filed_mapping",
        label: "字段映射",
        icon: <FolderViewOutlined />,
        level: 2,
      },
    ],
  },
  {
    key: "/document_review",
    label: "文档审核",
    icon: <SolutionOutlined />,
    level: 1,
    children: [
      {
        key: "/document_review/single_document_review",
        label: "单文档审核",
        icon: <FileSearchOutlined />,
        level: 2,
      },
      {
        key: "/document_review/multi_document_contrast",
        label: "监管文档对比",
        icon: <MergeCellsOutlined />,
        level: 2,
      },
      {
        key: "/document_review/multi_document_review",
        label: "多文档审核",
        icon: <OneToOneOutlined />,
        level: 2,
      },
    ],
  },
  { key: "/pdf_parse", label: "PDF解析", icon: <FilePptOutlined />, level: 1 },
  { key: "/video_cutting", label: "视频切割", icon: <SplitCellsOutlined />, level: 1 },
  { key: "/video_desc", label: "视频标注", icon: <RotateLeftOutlined />, level: 1 },
  { key: "/ar_pdf_view", label: "年报分析", icon: <FilePptOutlined />, level: 1 },
  {
    key: "/smart_training_assistant",
    label: "智能培训助理",
    icon: <SortAscendingOutlined />,
    level: 1,
  },
];

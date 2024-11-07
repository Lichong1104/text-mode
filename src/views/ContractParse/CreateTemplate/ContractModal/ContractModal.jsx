import React, { useEffect, useState } from "react";
import { Spin, Space, message, Modal, Input, Select } from "antd";
import { addFieldTagApi, getReviewedTempListApi, getReviewedTempParamsApi } from "@/api/httpApi";
import FieldComponent from "@/components/FieldComponent/FieldComponent";
import { Button } from "@aws-amplify/ui-react";
import globalColor from "@/store/color";

function ContractModal(props) {
  const { open } = props || {};

  //modal关闭
  const closeModal = () => props.onClose();

  //selectTags
  const [fieldTags, setFieldTags] = useState([]);
  const [templateFieldTags, setTemplateFieldTags] = useState(["甲方", "乙方"]);

  //TemplateSelect
  const [templateSelectOptions, setTemplateSelectOptions] = useState([]);
  const [templateShow, setTemplateShow] = useState(false);
  const [currentTemplateName, setCurrentTemplateName] = useState("");
  const [load, setLoad] = useState(false);
  const [templateInput, setTemplateInput] = useState("");
  const [templateLoading, setTemplateLoading] = useState(false);

  //获取模板列表
  useEffect(() => {
    getReviewedTempListApi().then((res) => {
      if (res.code === 200) {
        const data = res.data.map((item, i) => {
          return {
            value: item.template_name,
            label: item.template_name,
            key: i,
          };
        });
        setTemplateSelectOptions(data);
        if (templateInput) {
          // setCurrentTemplateName(templateInput);
          message.success("存储成功，等待管理审核！");
          setTemplateLoading(false);
        } else {
          setCurrentTemplateName(data[0].value);
        }
      }
    });
  }, [load]);

  //给父组件传递字段数据
  // useEffect(() => {
  //   if (fieldTags.length) {
  //     props.onChange(fieldTags);
  //   }
  // }, [fieldTags]);

  //获取单个Tags
  useEffect(() => {
    if (currentTemplateName) {
      getReviewedTempParamsApi(currentTemplateName).then((res) => {
        if (res.code === 200) {
          setFieldTags(res.data);
          setTemplateInput("");
          setTemplateFieldTags(["甲方", "乙方"]);
        }
      });
      // 传递给父组件
      props.onChange(currentTemplateName);
    }
  }, [currentTemplateName]);

  //模板选项改变
  const templateSelectChange = (value) => {
    setCurrentTemplateName(value);
  };

  //保存模板-改变
  const changeTemplate = () => {
    if (currentTemplateName) {
      addFieldTagApi(currentTemplateName, fieldTags).then((res) => {
        if (res.code === 200) {
          message.success("存储成功，等待管理审核！");
        }
      });
    }
  };

  //保存模板
  const saveTemplate = () => {
    if (templateInput) {
      setTemplateLoading(true);
      // console.log(templateInput, templateFieldTags);
      addFieldTagApi(templateInput, templateFieldTags).then((res) => {
        setTemplateLoading(false);
        if (res.code === 200) {
          setLoad(!load);
        } else {
          message.warning(res.data);
        }
      });
    } else {
      message.warning("模板名称为空！");
    }
  };

  return (
    <Modal
      okText="确定"
      cancelText="取消"
      width={"40vw"}
      height={"50vh"}
      title="解析字段设置"
      open={open}
      onOk={closeModal}
      onCancel={closeModal}
      footer={[
        <Space size="middle">
          <Button
            size="small"
            onClick={closeModal}
            variation="primary"
            backgroundColor={globalColor.buttonColor}
          >
            取消
          </Button>
          <Button
            onClick={closeModal}
            size="small"
            variation="primary"
            backgroundColor={globalColor.buttonColor}
          >
            确定
          </Button>
        </Space>,
      ]}
    >
      <div>
        当前模板 ：
        <Select
          value={currentTemplateName}
          style={{
            width: 200,
          }}
          onChange={templateSelectChange}
          options={templateSelectOptions}
        />
        <FieldComponent
          fieldTags={fieldTags}
          tagsChange={(v) => {
            setFieldTags(v);
          }}
        >
          <></>
          <Button
            size="small"
            variation="primary"
            backgroundColor={globalColor.buttonColor}
            onClick={changeTemplate}
          >
            保存模板
          </Button>
        </FieldComponent>
      </div>
      <div style={{ margin: "16px 0" }}>
        <Button
          size="small"
          variation="primary"
          backgroundColor={globalColor.buttonColor}
          onClick={() => setTemplateShow(true)}
        >
          新建模板
        </Button>
        {templateShow ? (
          <Spin tip="Loading..." size="large" spinning={templateLoading}>
            <FieldComponent
              fieldTags={templateFieldTags}
              tagsChange={(v) => {
                setTemplateFieldTags(v);
              }}
            >
              <Input
                placeholder="请输入模板名称"
                value={templateInput}
                onChange={(e) => setTemplateInput(e.currentTarget.value)}
              />
              <Button
                size="small"
                variation="primary"
                backgroundColor={globalColor.buttonColor}
                onClick={saveTemplate}
              >
                保存模板
              </Button>
              <Button
                size="small"
                variation="primary"
                colorTheme="overlay"
                onClick={() => setTemplateShow(false)}
              >
                取消
              </Button>
            </FieldComponent>
          </Spin>
        ) : undefined}
      </div>
    </Modal>
  );
}
ContractModal.defaultProps = {
  open: false,
  onClose: () => {},
  onChange: () => {},
};

export default ContractModal;

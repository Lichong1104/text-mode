import globalColor from "@/store/color";
import {
  changeVideoApi,
  getCutVideoApi,
  getCutVideoListApi,
  getVideoInfoApi,
} from "@/videoApi/httpApi";
import {
  BackwardOutlined,
  ForwardOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button } from "@aws-amplify/ui-react";
import {
  Checkbox,
  Col,
  Descriptions,
  Empty,
  InputNumber,
  Popconfirm,
  Slider,
  Spin,
  Tag,
  Tooltip,
  message,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

function CuttingDetail(props) {
  // 视频信息
  const [descItems, setDescItems] = useState([]);

  // 切分完成视频列表
  const [cutFinishList, setCutFinishList] = useState([]);

  // 切分列表
  const [cutList, setCutList] = useState([]);

  // 获取切分视频
  const cutVideo = async () => {
    const res = await getCutVideoListApi(props.v_id);
    if (res.code === 200) {
      const data = res.data.map((v) => {
        return {
          id: v.split("_")[v.split("_").length - 1].split(".")[0],
          name: v,
        };
      });
      // 排序
      data.sort((a, b) => a.id - b.id);

      setCutFinishList(data);
    }
  };

  // 初始化
  useEffect(() => {
    setVideoUrl(props.videoUrl);
    setLoading(true);
    setCutList([]);
    const init = async () => {
      const infoRes = await getVideoInfoApi(props.v_id);
      if (infoRes.code === 200) {
        const data = Object.entries(infoRes.data).map((v) => {
          return {
            label: v[0],
            children: v[1],
          };
        });
        setDescItems(data);
      }

      // 获取切分列表
      const cutListRes = await getCutVideoApi(props.v_id);
      if (cutListRes.code === 200) {
        const data = cutListRes.data.map((v, i) => {
          return {
            data: v.result,
            isPlay: false,
            active: true,
            key: v.id,
          };
        });
        setCutList(data);
      }

      await cutVideo();

      setLoading(false);
    };
    init();
  }, [props.v_id]);

  // video标签
  const videoRef = useRef(null);
  // 加载
  const [loading, setLoading] = useState(false);
  // 加载文本
  const [loadingText, setLoadingText] = useState("'加载中...'");

  // 视频地址
  const [videoUrl, setVideoUrl] = useState(props.videoUrl);

  // 视频结束时间
  const [videoEndTime, setVideoEndTime] = useState(null);

  // 开始播放
  const play = (v) => {
    videoRef.current.currentTime = v.data[0];
    v.isPlay ? videoRef.current.pause() : videoRef.current.play();
    setVideoEndTime(v.data[1]);

    const data = cutList.map((item) => {
      if (item.key === v.key) return { ...item, isPlay: !item.isPlay };
      return { ...item, isPlay: false };
    });
    setCutList(data);
  };

  // 视频播放事件
  const videoPlaying = () => {
    if (!videoEndTime) return;
    if (videoRef.current.currentTime >= videoEndTime) {
      videoRef.current.pause();
    }
  };

  // 更新切分
  const update = async () => {
    setLoadingText("正在更新切分");
    setLoading(true);

    const data = cutList.filter((v) => v.active).map((v) => ({ id: v.key, result: v.data }));
    console.log(data);
    const res = await changeVideoApi(JSON.stringify(data), props.v_id).catch(() => {
      message.error("更新失败");
      return setLoading(false);
    });

    if (res && res.code === 200) {
      setLoadingText("正在获取视频");
      await cutVideo();
      message.success("更新成功");
      setLoading(false);
    } else {
      message.error("更新失败");
      setLoading(false);
    }
  };

  // 改变视频地址
  const changeVideo = (url) => {
    setVideoUrl(url);
  };

  // 滑块值
  const [sliderValue, setSliderValue] = useState([0, 1]);

  // 滑块改变
  const sliderChange = (value, r) => {
    const newValue = value.map((v) => parseFloat(v.toFixed(2)));
    console.log(newValue);
    const data = cutList.map((v) => {
      if (v.key === r.key) return { ...v, data: newValue };
      return v;
    });
    setCutList(data);
  };

  // 是否选中
  const activeChange = (v) => {
    const data = cutList.map((item) => {
      if (item.key === v.key) return { ...item, active: !item.active };
      return item;
    });
    setCutList(data);
  };

  // 单个调整
  const singleChange = (value, r, type) => {
    const data = cutList.map((item) => {
      if (item.key === r.key) {
        if (type === "forward") return { ...item, data: [value, item.data[1]] };
        if (type === "backward") return { ...item, data: [item.data[0], value] };
      }
      return item;
    });
    setCutList(data);
  };

  return (
    <Spin size="large" tip={loadingText} spinning={loading}>
      <MainBox>
        <VideoBox>
          <VideoPlayer>
            <video
              onTimeUpdate={videoPlaying}
              src={videoUrl}
              ref={videoRef}
              playsInline
              controls
              style={{ width: "100%", height: "100%", backgroundColor: "#f5f5f5" }}
            ></video>
          </VideoPlayer>
          <VideoInfo className="myScroll">
            {cutFinishList.length ? (
              cutFinishList.map((v, i) => {
                return (
                  <Tooltip title={v.name} key={i}>
                    <VideoItem key={i} onClick={() => changeVideo(v.name)}>
                      <p>
                        第{v.id}段视频，地址：{v.name}
                      </p>
                    </VideoItem>
                  </Tooltip>
                );
              })
            ) : (
              <Empty style={{ marginTop: "70px" }} />
            )}
          </VideoInfo>
        </VideoBox>
        <CuttingBox>
          {/* <CutHeader>
            <Descriptions size="middle" bordered items={descItems} />
          </CutHeader> */}

          <CuttingList className="myScroll">
            {cutList.map((v, i) => {
              return (
                <div key={i} style={{ display: "flex", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div>
                      <Tag size="small" color="magenta">
                        {i + 1}
                      </Tag>
                    </div>
                  </div>
                  <CuttingItem>
                    {/* <span onClick={() => setSliderValue(v.data[0])}>{v.data[0]}</span> */}
                    <InputNumber
                      step={0.1}
                      value={v.data[0]}
                      onChange={(value) => singleChange(value, v, "forward")}
                    />
                    <PlayBtn>
                      <Tooltip title="播放">
                        <div
                          style={{ width: "80%", display: "flex", justifyContent: "center" }}
                          onClick={() => play(v)}
                        >
                          {v.isPlay ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                        </div>
                      </Tooltip>
                      <div style={{ width: "80%" }}>
                        <Col span={170}>
                          <Slider
                            min={v.data[0] >= 10 ? v.data[0] - 10 : 0}
                            max={v.data[1] + 10}
                            // min={0}
                            // max={100}
                            range
                            step={0.01}
                            onChange={(value) => sliderChange(value, v)}
                            value={[v.data[0], v.data[1]]}
                          />
                        </Col>
                      </div>
                    </PlayBtn>

                    <InputNumber
                      step={0.1}
                      value={v.data[1]}
                      onChange={(value) => singleChange(value, v, "backward")}
                    />
                  </CuttingItem>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox
                      size="large"
                      checked={v.active}
                      onChange={() => activeChange(v)}
                    ></Checkbox>
                  </div>
                </div>
              );
            })}
          </CuttingList>
          <CuttingFooter>
            <Button
              variation="primary"
              onClick={() => update()}
              size="small"
              backgroundColor={globalColor.buttonColor}
            >
              更新
            </Button>
          </CuttingFooter>
        </CuttingBox>
      </MainBox>
    </Spin>
  );
}

const MainBox = styled.div`
  height: 100%;
  display: flex;

  > div {
    width: 50%;
    height: 100%;
  }
`;

const VideoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  > div {
    height: 50%;
  }
`;

const VideoPlayer = styled.div`
  border-radius: 8px;
  overflow: hidden;
`;

const VideoInfo = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const VideoItem = styled.div`
  background-color: #f5f5f5;
  border-radius: 4px;
  > p {
    padding: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  cursor: pointer;
  &:hover {
    background-color: #dbd6d6b1;
  }
`;

const CuttingBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const CutHeader = styled.div`
  padding: 0 12px 8px 12px;
`;

const CuttingFooter = styled.div`
  padding: 12px;
  padding-bottom: 0;
  display: flex;
  justify-content: flex-end;
`;

const CuttingList = styled.div`
  background-color: white;
  gap: 12px;
  display: flex;
  flex-direction: column;
  padding: 12px;
  padding-top: 0;
`;

const CuttingItem = styled.div`
  flex: 1;
  background-color: #f5f5f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-top-left-radius: 25px;
  border-bottom-right-radius: 25px;
  border-bottom-left-radius: 25px;
  border-top-right-radius: 25px;
  cursor: pointer;
  > span {
    width: 40px;
  }
  &:hover {
    background-color: #dbd6d6b1;
  }
`;

const PlayBtn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 24px;
  //gap: 16px;
  color: #000000e8;
`;

export default CuttingDetail;

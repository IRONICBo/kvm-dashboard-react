/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  apiGetCacheData,
  apiGetGuestInfos,
  apiGetKeySet,
  apiGetMetricAgg,
} from '@/api/Monitor';
import { Line } from '@ant-design/plots';
import { useSearchParams } from '@umijs/max';
import { Col, DatePicker, Radio, Row, Select, Table, Tag, Button } from 'antd';
import { CloudDownloadOutlined } from '@ant-design/icons';
import ExportJsonExcel from "js-export-excel";
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import translateKey from '../../../utils/translate';

const SWAP_MEM_INFO_TABLE_CLOUMNS: ColumnsType = [
  {
    title: '交换空间设备名',
    key: 'name',
    dataIndex: 'name',
    width: '150px',
  },
  {
    title: '已用字节数',
    key: 'used_bytes',
    dataIndex: 'used_bytes',
    align: 'center',
    render: (_, { core_id }) => (
      <>
        {core_id ? (
          <Tag color="blue" key={core_id}>
            {core_id}
          </Tag>
        ) : (
          <Tag color="volcano" key={core_id}>
            未知
          </Tag>
        )}
      </>
    ),
  },
  {
    title: '空闲字节数',
    key: 'free_bytes',
    dataIndex: 'free_bytes',
    render: (_, { cores }) => (
      <>
        {cores ? (
          <Tag color="cyan" key={cores}>
            {cores}
          </Tag>
        ) : (
          <Tag color="volcano" key={cores}>
            未知
          </Tag>
        )}
      </>
    ),
  },
];

const MemStatCard: React.FC = () => {
  // Get UUID
  const [searchParams, setSearchParams] = useSearchParams();
  const UUID = searchParams.get('uuid') || '';
  console.log('UUID: ', UUID);

  const [data, setData] = useState([]);

  const TIME_PERIOD = ['10s', '1m', '30m'];
  const METHOD = ['first', 'last', 'distinct'];

  const config = {
    xField: 'time',
    yField: 'value',
  };

  const [metricList, setMetricList] = useState([
    { key: '请选择', value: '请选择' },
  ]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const metricType = 'mem_stat';
        let res = await apiGetKeySet(metricType);
        console.log('apiGetKeySet : ', res);

        // const deletedIndex = res.indexOf('mem_stat.connection_stats');
        // if (deletedIndex > -1) {
        //   res.splice(deletedIndex, 1);
        // }

        console.log('res', res);
        const tempMetricList = res.map((item) => {
          return {
            value: item,
            label: translateKey(item),
          };
        });
        setMetricList(tempMetricList);
        // set default metric
        setSelectedMetric(tempMetricList[0].value);
        console.log('metricList : ', tempMetricList);
      } catch (error) {
        console.error('Error retrieving guest infos:', error);
      }
    };
    fetchData();
  }, [UUID]);

  const { RangePicker } = DatePicker;

  // Form
  const [selectedStartTime, setSelectedStartTime] = useState(
    Math.floor(new Date().getTime() / 1000) - 200,
  );
  const [selectedEndTime, setSelectedEndTime] = useState(
    Math.floor(new Date().getTime() / 1000),
  );
  const [selectedPeriod, setSelectedPeriod] = useState('10s');
  const [selectedMethod, setSelectedMethod] = useState('first');
  const [selectedMetric, setSelectedMetric] = useState(
    'net_stat.proto_counters_stats.ip.InReceives',
  );
  const [chartList, selectChartList] = useState([]);

  // dayjs
  const handleRangeTimeChange = (
    dates: [any, any],
    dateStrings: [string, string],
  ) => {
    console.log('Selected Time: ', dates);
    console.log('Formatted Selected Time: ', dateStrings);
    // To timestamp (second)
    const startTimestamp = new Date(dateStrings[0]).getTime() / 1000;
    const endTimestamp = new Date(dateStrings[1]).getTime() / 1000;

    setSelectedStartTime(startTimestamp);
    setSelectedEndTime(endTimestamp);
  };
  const handleMethodChange = (e: any) => {
    console.log(`selected ${e.target.value}`);
    setSelectedMethod(e.target.value);
  };
  const handlePeriodChange = (e: any) => {
    console.log(`selected ${e.target.value}`);
    setSelectedPeriod(e.target.value);
  };
  const handleMetricListChange = (value: string) => {
    console.log(`selected ${value}`);
    setSelectedMetric(value);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // check empty
        if (
          selectedMetric === '' ||
          selectedPeriod === '' ||
          selectedMethod === '' ||
          selectedStartTime === 0 ||
          selectedEndTime === 0
        ) {
          return;
        }

        const res = await apiGetMetricAgg(
          selectedMethod,
          selectedPeriod,
          selectedStartTime,
          selectedEndTime,
          selectedMetric,
          UUID,
        );
        console.log('apiGetMetricAgg : ', res);
        if (res == undefined || res == null || res.length === 0) {
          return;
        }

        // change data format, get value and time
        selectChartList(
          res.map((item) => {
            return {
              value: item.value,
              // 格式化时间
              time: new Date(item.time * 1000).toISOString(),
            };
          }),
        );
        console.log('chartList: ', chartList);
      } catch (error) {
        console.error('Error retrieving guest infos:', error);
      }
    };
    fetchData();
  }, [
    selectedMetric,
    selectedStartTime,
    selectedEndTime,
    selectedPeriod,
    selectedMethod,
  ]);

  const downloadExcel = () => {
    var option:any = {
      fileName:translateKey(selectedMetric),
      datas:[],
    };
    option.datas = [
      {
        sheetData: chartList,
        sheetName: "监测指标",
        sheetFilter: ["value", "time"],
        sheetHeader: ["指标值", "测量时间"],
        columnWidths: [30, 30],
      },
    ];
    var toExcel = new ExportJsonExcel(option); //new
    toExcel.saveExcel(); //保存
  }

  return (
    <>
      <Row className='for-export-word' gutter={0} style={{ marginBottom: '20px' }}>
        <Col
          className="gutter-row"
          span={16}
          style={{
            maxHeight: '300px',
            overflow: 'auto',
          }}
        >
          监测指标：
          <Select
            showSearch
            defaultValue={metricList[0].value}
            style={{ width: 500 }}
            onChange={handleMetricListChange}
            onSearch={handleMetricListChange}
            options={metricList}
          />
        </Col>
        <Col className="gutter-row" span={8}>
          监测策略：
          <Radio.Group
            defaultValue={METHOD[0]}
            buttonStyle="solid"
            onChange={handleMethodChange}
          >
            {METHOD.map((item) => (
              <Radio.Button key={item} value={item}>
                {item}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Col>
      </Row>
      <Row className='for-export-word' gutter={0} style={{ marginBottom: '20px' }}>
        <Col className="gutter-row" span={16}>
          监测区间：
          <RangePicker showTime onChange={handleRangeTimeChange} />
        </Col>
        <Col className="gutter-row" span={8}>
          监测粒度：
          <Radio.Group
            defaultValue={TIME_PERIOD[0]}
            buttonStyle="solid"
            onChange={handlePeriodChange}
          >
            {TIME_PERIOD.map((item) => (
              <Radio.Button key={item} value={item}>
                {item}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Col>
      </Row>
      <Line className='for-export-word' {...config} data={chartList} />
      <Button 
          type="primary"
          style={{
            marginTop: "20px"
          }}
          size="large"
          icon={<CloudDownloadOutlined />}
          onClick={() => downloadExcel()}>
          导出Excel
      </Button>
    </>
  );
};

const MemLoadStatCard: React.FC = () => {
  const [UUID, setUUID] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const uuid = searchParams.get('uuid') || '';
    setUUID(uuid);
  }, []);
  const [data, setData] = useState([]);

  const random = Math.random().toString(36).slice(-8);
  // TODO: Modify statType
  // TODO: Modify statType
  // TODO: Modify statType
  const statType = 'mem_stat';
  const [memPercentStat, setMemPercentStat] = useState([]);
  const [swapPercentStat, setSwapPercentStat] = useState([]);
  const [recvNewEvent, setRecvNewEvent] = useState(0);

  useEffect(() => {
    const websocket = new WebSocket(
      'ws://' + window.location.hostname + ':28080/api/websocket/monitor/' +
        UUID +
        '/' +
        statType +
        '/' +
        random,
    );
    websocket.onopen = function () {
      console.log('websocket open');
    };
    websocket.onmessage = function (msg) {
      console.log(msg.data);
      const tempMemPercentStat = [];
      const tempSwapPercentStat = [];
      // change data format, get value and time
      const ioItem = JSON.parse(msg.data);
      // time => timestamp, interfaces => key, value => send_bytes

      Object.keys(ioItem).forEach((key) => {
        if (key !== 'timestamp') {
          tempMemPercentStat.push({
            time: new Date(
              ioItem.timestamp * 1000 + 8 * 60 * 60 * 1000,
            ).toISOString(),
            interfaces: key,
            value: ioItem[key].bytes_sent,
          });
          tempSwapPercentStat.push({
            time: new Date(
              ioItem.timestamp * 1000 + 8 * 60 * 60 * 1000,
            ).toISOString(),
            interfaces: key,
            value: ioItem[key].bytes_recv,
          });
        }
      });

      // setIOBytesSendStat([...ioBytesSendStat, ...tempIOBytesSendStat]);
      // setIOBytesRecvStat([...ioBytesRecvStat, ...tempIOBytesRecvStat]);
      // setIOPacketsSendStat([...ioPacketsSendStat, ...tempIOPacketsSendStat]);
      // setIOPacketsRecvStat([...ioPacketsRecvStat, ...tempIOPacketsRecvStat]);
      setRecvNewEvent(new Date().getTime());
    };
    websocket.onclose = function () {
      console.log('websocket closed');
    };
    websocket.onerror = function () {
      console.log('websocket error');
    };
  }, [UUID]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statType = 'mem_stat';
        const res = await apiGetCacheData(statType, UUID);
        console.log('parsedIOStat: ', res);

        const tempMemPercentStat:
          | ((prevState: never[]) => never[])
          | { time: string; name: string; value: any }[] = [];
        const tempSwapPercentStat:
          | ((prevState: never[]) => never[])
          | { time: string; name: string; value: any }[] = [];
        // change data format, get value and time
        res.forEach((element) => {
          const memItem = JSON.parse(element);
          // time => timestamp, interfaces => key, value => send_bytes

          Object.keys(memItem).forEach((key) => {
            // TODO: Modify statType
            // TODO: Modify statType
            // TODO: Modify statType
            if (key !== 'timestamp') {
              tempMemPercentStat.push({
                time: new Date(
                  memItem.timestamp * 1000 + 8 * 60 * 60 * 1000,
                ).toISOString(),
                name: 'virtualMemoryUsedPercent',
                value: parseFloat(memItem.virtualMemoryUsedPercent),
              });
              tempSwapPercentStat.push({
                time: new Date(
                  memItem.timestamp * 1000 + 8 * 60 * 60 * 1000,
                ).toISOString(),
                name: 'swapMemoryUsedPercent',
                value: parseFloat(memItem.swapMemoryUsedPercent),
              });
            }
          });
        });

        setMemPercentStat(tempMemPercentStat);
        setSwapPercentStat(tempSwapPercentStat);
      } catch (error) {
        console.error('Error retrieving guest infos:', error);
      }
    };

    fetchData();
  }, [UUID, recvNewEvent]);

  const config = {
    xField: 'time',
    yField: 'value',
    seriesField: 'name',
  };

  return (
    <>
      <Row className='for-export-word'> 
        <Col span={12}>
          虚拟内存占用百分比
          <Line {...config} data={memPercentStat} />
        </Col>
        <Col span={12}>
          交换内存占用百分比
          <Line {...config} data={swapPercentStat} />
        </Col>
      </Row>
    </>
  );
};

const MemInfoCard: React.FC = () => {
  const [UUID, setUUID] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const uuid = searchParams.get('uuid') || '';
    setUUID(uuid);
  }, []);

  const [memInfo, setMemInfo] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiGetGuestInfos(UUID);
        const parsedMemDesc = JSON.parse(res.memDesc);
        console.log('swap_devices: ', parsedMemDesc.swap_devices);
        setMemInfo(parsedMemDesc.swap_devices);
      } catch (error) {
        console.error('Error retrieving guest infos:', error);
      }
    };

    fetchData();
  }, [UUID]);

  return (
    <div>
      <div
        style={{
          fontSize: '20px',
          marginBottom: '20px',
        }}
      >
        交换空间硬件配置
      </div>
      {memInfo.length !== 0 && (
        <Table columns={SWAP_MEM_INFO_TABLE_CLOUMNS} dataSource={memInfo} />
      )}
      <div
        style={{
          fontSize: '20px',
          marginBottom: '20px',
        }}
      >
        内存占用
      </div>
      <MemLoadStatCard />

      <div
        style={{
          fontSize: '20px',
          marginTop: '100px',
          marginBottom: '20px',
        }}
      >
        历史监测信息
      </div>
      <MemStatCard />
    </div>
  );
};

export default MemInfoCard;

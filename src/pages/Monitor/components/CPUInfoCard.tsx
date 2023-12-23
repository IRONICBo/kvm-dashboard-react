/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  apiGetCacheData,
  apiGetGuestInfos,
  apiGetKeySet,
  apiGetMetricAgg,
  apiGetMetricPage,
} from '@/api/Monitor';
import { Base, Heatmap, Line, Plot, PlotEvent } from '@ant-design/plots';
import { useSearchParams } from '@umijs/max';
import { Col, DatePicker, Radio, Row, Select, Table, Tag, Button} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CloudDownloadOutlined } from '@ant-design/icons';
import ExportJsonExcel from "js-export-excel";
import React, { useEffect, useState } from 'react';
import translateKey from '../../../utils/translate';

const CPU_INFO_TABLE_CLOUMNS: ColumnsType = [
  {
    title: '处理器标识符',
    key: 'cpu',
    dataIndex: 'cpu',
    width: '150px',
  },
  // {
  //   title: '处理器制造商标识符',
  //   key: 'vendor_id',
  //   dataIndex: 'vendor_id',
  //   render: (_, { vendor_id }) => (
  //     <>
  //       {vendor_id ? (
  //         <Tag color="blue" key={vendor_id}>
  //           {vendor_id}
  //         </Tag>
  //       ) : (
  //         <Tag color="volcano" key={vendor_id}>
  //           未知
  //         </Tag>
  //       )}
  //     </>
  //   ),
  // },
  // {
  //   title: '处理器系列',
  //   key: 'family',
  //   dataIndex: 'family',
  //   render: (_, { family }) => (
  //     <>
  //       {family ? (
  //         <Tag color="blue" key={family}>
  //           {family}
  //         </Tag>
  //       ) : (
  //         <Tag color="volcano" key={family}>
  //           未知
  //         </Tag>
  //       )}
  //     </>
  //   ),
  // },
  // {
  //     title: '物理处理器标识符',
  //     key: 'physical_id',
  //     dataIndex: 'physical_id',
  //     render: (_, { physical_id }) => (
  //         <>
  //             {physical_id ? (
  //             <Tag color="blue" key={physical_id}>
  //                 {physical_id}
  //             </Tag>
  //             ) : (
  //             <Tag color="volcano" key={physical_id}>
  //                 未知
  //             </Tag>
  //             )}
  //         </>
  //     ),
  // },
  {
    title: '核心标识符',
    key: 'core_id',
    dataIndex: 'core_id',
    width: '120px',
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
    title: '核心数',
    key: 'cores',
    dataIndex: 'cores',
    width: '100px',
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
  {
    title: '处理器型号名称',
    key: 'model_name',
    dataIndex: 'model_name',
    render: (_, { model_name }) => (
      <>
        {model_name ? (
          <Tag color="purple" key={model_name}>
            {model_name}
          </Tag>
        ) : (
          <Tag color="volcano" key={model_name}>
            未知
          </Tag>
        )}
      </>
    ),
  },
  // {
  //     title: '处理器主频/兆赫兹',
  //     key: 'mhz',
  //     dataIndex: 'mhz',
  //     render: (_, { mhz }) => (
  //         <>
  //             {mhz ? (
  //             <Tag color="blue" key={mhz}>
  //                 {mhz}
  //             </Tag>
  //             ) : (
  //             <Tag color="volcano" key={mhz}>
  //                 未知
  //             </Tag>
  //             )}
  //         </>
  //     ),
  // },
  // {
  //     title: '处理器缓存大小',
  //     key: 'cache_size',
  //     dataIndex: 'cache_size',
  //     render: (_, { cache_size }) => (
  //         <>
  //             {cache_size ? (
  //             <Tag color="blue" key={cache_size}>
  //                 {cache_size}
  //             </Tag>
  //             ) : (
  //             <Tag color="volcano" key={cache_size}>
  //                 未知
  //             </Tag>
  //             )}
  //         </>
  //     ),
  // },
  {
    title: '处理器特性',
    key: 'flags',
    dataIndex: 'flags',
    render: (_, { flags }) => (
      <>
        {flags.map((flag) => {
          let color = flag.length > 5 ? 'geekblue' : 'green';
          if (flag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={flag}>
              {flag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  // {
  //     title: '处理器微码',
  //     key: 'microcode',
  //     dataIndex: 'microcode',
  // },
  {
    title: '修订号',
    key: 'stepping',
    dataIndex: 'stepping',
    width: '100px',
    render: (_, { stepping }) => (
      <>
        {stepping ? (
          <Tag color="gold" key={stepping}>
            {stepping}
          </Tag>
        ) : (
          <Tag color="volcano" key={stepping}>
            未知
          </Tag>
        )}
      </>
    ),
  },
];

const CPUStatCard: React.FC = () => {
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
        const metricType = 'cpu_stat';
        let res = await apiGetKeySet(metricType);
        console.log('apiGetKeySet : ', res);

        const deletedIndex = res.indexOf('cpu_stat.cpu_time_stats');
        if (deletedIndex > -1) {
          res.splice(deletedIndex, 1);
        }

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

const CPUTimeStatCard: React.FC = () => {
  // Get UUID
  const [searchParams, setSearchParams] = useSearchParams();
  const UUID = searchParams.get('uuid') || '';
  console.log('UUID: ', UUID);

  const config = {
    xField: 'time',
    yField: 'value',
  };

  // TODO: Modify metricList
  // TODO: Modify metricList
  // TODO: Modify metricList
  const [metricList, setMetricList] = useState([
    { key: 'cpu_stat.cpu_time_stats', value: translateKey('cpu_stat.cpu_time_stats') },
  ]);

  const { RangePicker } = DatePicker;

  const CPU_TABLE_CLOUMNS: ColumnsType = [
    {
      title: '处理器',
      key: 'cpu',
      dataIndex: 'cpu',
    },
    {
      title: '用户态时间片',
      key: 'user',
      dataIndex: 'user',
      render: (_, { user }) => (
        <>
          <Tag color="magenta" key={user}>
            {user}
          </Tag>
        </>
      ),
    },
    {
      title: '系统态时间片',
      key: 'system',
      dataIndex: 'system',
      render: (_, { system }) => (
        <>
          <Tag color="magenta" key={system}>
            {system}
          </Tag>
        </>
      ),
    },
    {
      title: '空闲时间片',
      key: 'idle',
      dataIndex: 'idle',
      render: (_, { idle }) => (
        <>
          <Tag color="blue" key={idle}>
            {idle}
          </Tag>
        </>
      ),
    },
    {
      title: '低优先级时间片',
      key: 'nice',
      dataIndex: 'nice',
      render: (_, { nice }) => (
        <>
          <Tag color="blue" key={nice}>
            {nice}
          </Tag>
        </>
      ),
    },
    {
      title: '等待输入/出时间片',
      key: 'iowait',
      dataIndex: 'iowait',
      render: (_, { iowait }) => (
        <>
          <Tag color="blue" key={iowait}>
            {iowait}
          </Tag>
        </>
      ),
    },
    {
      title: '硬件中断时间片',
      key: 'irq',
      dataIndex: 'irq',
      render: (_, { irq }) => (
        <>
          <Tag color="green" key={irq}>
            {irq}
          </Tag>
        </>
      ),
    },
    {
      title: '软件中断时间片',
      key: 'softirq',
      dataIndex: 'softirq',
      render: (_, { softirq }) => (
        <>
          <Tag color="green" key={softirq}>
            {softirq}
          </Tag>
        </>
      ),
    },
    {
      title: '被盗用时间片',
      key: 'steal',
      dataIndex: 'steal',
      render: (_, { steal }) => (
        <>
          <Tag color="red" key={steal}>
            {steal}
          </Tag>
        </>
      ),
    },
    {
      title: '虚拟化时间片',
      key: 'guest',
      dataIndex: 'guest',
      render: (_, { guest }) => (
        <>
          <Tag color="purple" key={guest}>
            {guest}
          </Tag>
        </>
      ),
    },
    {
      title: '低优先级虚拟化时间片',
      key: 'guest_nice',
      dataIndex: 'guest_nice',
      render: (_, { guest_nice }) => (
        <>
          <Tag color="purple" key={guest_nice}>
            {guest_nice}
          </Tag>
        </>
      ),
    },
  ];

  // Form
  const [selectedStartTime, setSelectedStartTime] = useState(
    Math.floor(new Date().getTime() / 1000) - 200,
  );
  const [selectedEndTime, setSelectedEndTime] = useState(
    Math.floor(new Date().getTime() / 1000),
  );
  const [selectedMetric, setSelectedMetric] = useState('');
  const [chartList, selectChartList] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [connTableData, setConnTableData] = useState([]);
  const [selectTime, setSelectTime] = useState(0);

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
  const handleMetricListChange = (value: string) => {
    console.log(`selected ${value}`);
    setSelectedMetric(value);
  };

  useEffect(() => {
    console.log(selectTime);
    console.log(tempData);

    // find tempData.time == selectTime
    let tempConnTableData = tempData.filter((item) => {
      return item.time == selectTime;
    });
    if (
      tempConnTableData != undefined &&
      tempConnTableData != null &&
      tempConnTableData.length > 0
    ) {
      tempConnTableData = tempConnTableData[0].value;
      tempConnTableData = JSON.parse(tempConnTableData);
    }

    console.log(tempConnTableData);
    setConnTableData(tempConnTableData);
  }, [selectTime]);

  const PlotMaps: Record<string, Plot<Base>> = {};
  const setTableData = (evt: PlotEvent, plot: Plot<Base>) => {
    const { x, y } = evt.gEvent;
    const currentData = plot.chart.getTooltipItems({ x, y });
    const currentTime = Date.parse(currentData[0]?.data.time) / 1000;
    console.log('currentTime', currentTime);
    setSelectTime(currentTime);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // check empty
        // if (selectedStartTime === 0 || selectedEndTime === 0) {
        //   return;
        // }

        // Max is 100
        const res = await apiGetMetricPage(
          selectedEndTime,
          'cpu_stat.cpu_time_stats',
          50,
          0,
          selectedStartTime,
          UUID,
        );
        console.log('apiGetMetricPage : ', res);
        if (res == undefined || res == null || res.length === 0) {
          return;
        }

        setTempData(
          res.map((item) => {
            return {
              value: item.value,
              time: item.time,
            };
          }),
        );
        console.log('tempData: ', tempData);

        // change data format, get value and time
        selectChartList(
          res.map((item) => {
            return {
              value: JSON.parse(item.value).length,
              time: new Date(item.time * 1000).toISOString(),
            };
          }),
        );
        console.log('chartList: ', chartList);

        // Set default select time
        setSelectTime(res[0].time);
      } catch (error) {
        console.error('Error retrieving guest infos:', error);
      }
    };
    fetchData();
  }, [selectedStartTime, selectedEndTime]);

  const downloadExcel = () => {
    var option:any = {
      fileName:translateKey('cpu_stat.cpu_time_stats'),
      datas:[],
    };
    const tempConnTableData = connTableData;
    option.datas = [
      {
        sheetData: tempConnTableData,
        sheetName: "监测指标",
        sheetFilter: ["cpu", "user", "system", "idle", "nice", "iowait", "irq", "softirq", "steal", "guest", "guest_nice"],
        sheetHeader: ["处理器", "用户态时间片", "系统态时间片", "空闲时间片", "低优先级时间片", "等待输入/出时间片", "硬件中断时间片", "软件中断时间片", "被盗用时间片", "虚拟化时间片", "低优先级虚拟化时间片"],
        columnWidths: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
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
          span={12}
          style={{
            maxHeight: '300px',
            overflow: 'auto',
          }}
        >
          监测指标：
          <Select
            showSearch
            defaultValue={metricList[0].value}
            style={{ width: 300 }}
            onChange={handleMetricListChange}
            onSearch={handleMetricListChange}
            options={metricList}
          />
        </Col>
        <Col className="gutter-row" span={12}>
          监测区间：
          <RangePicker showTime onChange={handleRangeTimeChange} />
        </Col>
      </Row>
      <Line
        className='for-export-word'
        {...config}
        data={chartList}
        onReady={(plot) => {
          PlotMaps.line = plot;
          plot.on('element:click', (evt: PlotEvent) => {
            setTableData(evt, plot);
          });
        }}
        style={{ marginBottom: '50px' }}
      />
      <div style={{
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
      }}>
        {new Date(selectTime * 1000 + 8 * 60 * 60 * 1000).toISOString() +
        ' 时刻处理器状态'}
        <Button 
          type="primary"
          style={{
          }}
          size="large"
          icon={<CloudDownloadOutlined />}
          onClick={() => downloadExcel()}>
        导出Excel
        </Button>
      </div>
      {connTableData.length !== 0 && (
        <Table columns={CPU_TABLE_CLOUMNS} dataSource={connTableData} />
      )}
    </>
  );
};

const CPULoadStatCard: React.FC = () => {
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
  const statType = 'cpu_stat';
  const [cpuPercentStat, setCPUPercentStat] = useState([]);
  const [cpuLoadStat, setCPULoadStat] = useState([]);
  const [recvNewEvent, setRecvNewEvent] = useState(0);

  useEffect(() => {
    const websocket = new WebSocket(
      'ws://localhost:28080/api/websocket/monitor/' +
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
      const tempCPUPercentStat = [];
      const tempCPULoadStat = [];
      // change data format, get value and time
      const ioItem = JSON.parse(msg.data);
      // time => timestamp, interfaces => key, value => send_bytes

      Object.keys(ioItem).forEach((key) => {
        if (key !== 'timestamp') {
          tempCPUPercentStat.push({
            time: new Date(
              ioItem.timestamp * 1000 + 8 * 60 * 60 * 1000,
            ).toISOString(),
            interfaces: key,
            value: ioItem[key].bytes_sent,
          });
          tempCPULoadStat.push({
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
        const statType = 'cpu_stat';
        const res = await apiGetCacheData(statType, UUID);
        console.log('parsedIOStat: ', res);

        const tempCPUPercentStat:
          | ((prevState: never[]) => never[])
          | { time: string; name: string; value: any }[] = [];
        const tempCPULoadStat:
          | ((prevState: never[]) => never[])
          | { time: string; name: string; value: any }[] = [];
        // change data format, get value and time
        res.forEach((element) => {
          const cpuItem = JSON.parse(element);
          // time => timestamp, interfaces => key, value => send_bytes

          Object.keys(cpuItem).forEach((key) => {
            // TODO: Modify statType
            // TODO: Modify statType
            // TODO: Modify statType
            if (key == 'cpu_percents') {
              // 遍历cpu_percents数组
              cpuItem.cpu_percents.forEach((v, i) => {
                tempCPUPercentStat.push({
                  time: new Date(cpuItem.timestamp * 1000 + 8 * 60 * 60 * 1000)
                    .toISOString()
                    .substring(11, 19),
                  name: 'cpu-' + i,
                  value: parseFloat(v),
                });
              });
            } else if (key == 'cpu_load') {
              Object.keys(cpuItem.cpu_load).forEach((key) => {
                tempCPULoadStat.push({
                  time: new Date(
                    cpuItem.timestamp * 1000 + 8 * 60 * 60 * 1000,
                  ).toISOString(),
                  name: key,
                  value: cpuItem.cpu_load[key],
                });
              });
            }
          });
        });

        setCPUPercentStat(tempCPUPercentStat);
        setCPULoadStat(tempCPULoadStat);
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

  const heatmapConfig = {
    width: 500,
    autoFit: false,
    data,
    xField: 'time',
    yField: 'name',
    colorField: 'value',
    color: ['#174c83', '#7eb6d4', '#efefeb', '#efa759', '#9b4d16'],
    tooltip: {
      showMarkers: false,
    },
    pattern: {
      type: 'square',
      cfg: {
        isStagger: true,
      },
    },
  };

  return (
    <>
      <Row>
        <Col className='for-export-word' span={12}>
          处理器占用
          <div style={{ marginBottom: '10px' }}></div>
          <Line {...config} data={cpuPercentStat} />
          {/* <Heatmap {...heatmapConfig} data={cpuPercentStat} /> */}
        </Col>
        <Col className='for-export-word' span={12}>
          处理器负载
          <Line {...config} data={cpuLoadStat} />
        </Col>
      </Row>
    </>
  );
};

const CPUInfoCard: React.FC = () => {
  const [UUID, setUUID] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const uuid = searchParams.get('uuid') || '';
    setUUID(uuid);
  }, []);

  const [cpuInfo, setCPUInfo] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiGetGuestInfos(UUID);
        const parsedCPUDesc = JSON.parse(res.cpuDesc);
        console.log('cpu_basic_infos: ', parsedCPUDesc.cpu_basic_infos);
        setCPUInfo(parsedCPUDesc.cpu_basic_infos);
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
        处理器配置
      </div>
      {cpuInfo.length !== 0 && (
        <Table columns={CPU_INFO_TABLE_CLOUMNS} dataSource={cpuInfo} />
      )}
      <div
        style={{
          fontSize: '20px',
          marginBottom: '20px',
        }}
      >
        处理器占用
      </div>
      <CPULoadStatCard />

      <div
        style={{
          fontSize: '20px',
          marginTop: '100px',
          marginBottom: '20px',
        }}
      >
        历史监测信息
      </div>
      <CPUStatCard />

      <div
        style={{
          fontSize: '20px',
          marginTop: '100px',
          marginBottom: '20px',
        }}
      >
        处理器时间片信息
      </div>
      <CPUTimeStatCard />
    </div>
  );
};

export default CPUInfoCard;

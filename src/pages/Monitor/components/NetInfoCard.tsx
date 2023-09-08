/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  apiGetCacheData,
  apiGetGuestInfos,
  apiGetKeySet,
  apiGetMetricAgg,
  apiGetMetricPage,
} from '@/api/Monitor';
import { Area, Base, Line, Plot, PlotEvent } from '@ant-design/plots';
import { useSearchParams } from '@umijs/max';
import { Col, DatePicker, Radio, Row, Select, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';

const TEMP_NET_INFO_DATA = [
  {
    index: 0,
    mtu: 65536,
    name: 'lo',
    hardwareaddr: '',
    flags: ['up', 'loopback'],
    addrs: [
      {
        addr: '127.0.0.1/8',
      },
      {
        addr: '::1/128',
      },
    ],
  },
  {
    index: 0,
    mtu: 1500,
    name: 'enp1s0',
    hardwareaddr: '52:54:00:a8:8c:28',
    flags: ['up', 'broadcast', 'multicast'],
    addrs: [
      {
        addr: '192.168.122.166/24',
      },
      {
        addr: 'fe80::17c4:7b8f:7947:288c/64',
      },
    ],
  },
];
const NET_INFO_TABLE_CLOUMNS: ColumnsType = [
  {
    title: '名称',
    key: 'name',
    dataIndex: 'name',
  },
  {
    title: 'MTU',
    key: 'mtu',
    dataIndex: 'mtu',
  },
  {
    title: '硬件地址',
    key: 'hardwareaddr',
    dataIndex: 'hardwareaddr',
  },
  {
    title: '标志',
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
  {
    title: '地址',
    key: 'addrs',
    dataIndex: 'addrs',
    render: (_, { addrs }) => (
      <>
        {addrs.map((addr) => {
          return (
            <Tag color="cyan" key={addr.addr}>
              {addr.addr}
            </Tag>
          );
        })}
      </>
    ),
  },
];

const NetIOCard: React.FC = () => {
  const [UUID, setUUID] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const uuid = searchParams.get('uuid') || '';
    setUUID(uuid);
  }, []);
  const [data, setData] = useState([]);

  const random = Math.random().toString(36).slice(-8);
  const statType = 'net_stat';
  const [ioBytesSendStat, setIOBytesSendStat] = useState([]);
  const [ioBytesRecvStat, setIOBytesRecvStat] = useState([]);
  const [ioPacketsSendStat, setIOPacketsSendStat] = useState([]);
  const [ioPacketsRecvStat, setIOPacketsRecvStat] = useState([]);
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
      const tempIOBytesSendStat = [];
      const tempIOBytesRecvStat = [];
      const tempIOPacketsSendStat = [];
      const tempIOPacketsRecvStat = [];
      // change data format, get value and time
      const ioItem = JSON.parse(msg.data);
      // time => timestamp, interfaces => key, value => send_bytes

      Object.keys(ioItem).forEach((key) => {
        if (key !== 'timestamp') {
          tempIOBytesSendStat.push({
            time: new Date(
              ioItem.timestamp * 1000 + 8 * 60 * 60 * 1000,
            ).toISOString(),
            interfaces: key,
            value: ioItem[key].bytes_sent,
          });
          tempIOBytesRecvStat.push({
            time: new Date(
              ioItem.timestamp * 1000 + 8 * 60 * 60 * 1000,
            ).toISOString(),
            interfaces: key,
            value: ioItem[key].bytes_recv,
          });
          tempIOPacketsSendStat.push({
            time: new Date(
              ioItem.timestamp * 1000 + 8 * 60 * 60 * 1000,
            ).toISOString(),
            interfaces: key,
            value: ioItem[key].packets_sent,
          });
          tempIOPacketsRecvStat.push({
            // +8*60*60*1000
            time: new Date(
              ioItem.timestamp * 1000 + 8 * 60 * 60 * 1000,
            ).toISOString(),
            interfaces: key,
            value: ioItem[key].packets_recv,
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
        const statType = 'net_stat';
        const res = await apiGetCacheData(statType, UUID);
        console.log('parsedIOStat: ', res);

        const tempIOBytesSendStat: ((prevState: never[]) => never[]) | { time: string; interfaces: string; value: any; }[] = [];
        const tempIOBytesRecvStat: ((prevState: never[]) => never[]) | { time: string; interfaces: string; value: any; }[] = [];
        const tempIOPacketsSendStat = [];
        const tempIOPacketsRecvStat = [];
        // change data format, get value and time
        res.forEach((element) => {
          const ioItem = JSON.parse(element);
          // time => timestamp, interfaces => key, value => send_bytes

          Object.keys(ioItem).forEach((key) => {
            if (key !== 'timestamp') {
              tempIOBytesSendStat.push({
                time: new Date(
                  ioItem.timestamp * 1000 + 8 * 60 * 60 * 1000,
                ).toISOString(),
                interfaces: key,
                value: ioItem[key].bytes_sent,
              });
              tempIOBytesRecvStat.push({
                time: new Date(
                  ioItem.timestamp * 1000 + 8 * 60 * 60 * 1000,
                ).toISOString(),
                interfaces: key,
                value: ioItem[key].bytes_recv,
              });
              tempIOPacketsSendStat.push({
                time: new Date(
                  ioItem.timestamp * 1000 + 8 * 60 * 60 * 1000,
                ).toISOString(),
                interfaces: key,
                value: ioItem[key].packets_sent,
              });
              tempIOPacketsRecvStat.push({
                time: new Date(
                  ioItem.timestamp * 1000 + 8 * 60 * 60 * 1000,
                ).toISOString(),
                interfaces: key,
                value: ioItem[key].packets_recv,
              });
            }
          });
        });

        setIOBytesSendStat(tempIOBytesSendStat);
        setIOBytesRecvStat(tempIOBytesRecvStat);
        setIOPacketsSendStat(tempIOBytesSendStat);
        setIOPacketsRecvStat(tempIOBytesRecvStat);
      } catch (error) {
        console.error('Error retrieving guest infos:', error);
      }
    };

    fetchData();
  }, [UUID, recvNewEvent]);

  const config = {
    xField: 'time',
    yField: 'value',
    seriesField: 'interfaces',
  };

  return (
    <>
      <Row>
        <Col span={12}>
          网卡发送字节流量
          <Line {...config} data={ioBytesSendStat} />
        </Col>
        <Col span={12}>
          网卡接收字节流量
          <Line {...config} data={ioBytesRecvStat} />
        </Col>
      </Row>
      <Row style={{ marginTop: '50px' }}>
        <Col span={12}>
          网卡发送包流量
          <Line {...config} data={ioPacketsSendStat} />
        </Col>
        <Col span={12}>
          网卡接收包流量
          <Line {...config} data={ioPacketsRecvStat} />
        </Col>
      </Row>
    </>
  );
};

const NetStatCard: React.FC = () => {
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
        const metricType = 'net_stat';
        let res = await apiGetKeySet(metricType);
        console.log('apiGetKeySet : ', res);

        const deletedIndex = res.indexOf('net_stat.connection_stats');
        if (deletedIndex > -1) {
          res.splice(deletedIndex, 1);
        }

        console.log('res', res);
        const tempMetricList = res.map((item) => {
          return {
            value: item,
            label: item,
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

  return (
    <>
      <Row gutter={0} style={{ marginBottom: '20px' }}>
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
      <Row gutter={0} style={{ marginBottom: '20px' }}>
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
      <Line {...config} data={chartList} />
    </>
  );
};

const NetConnStatCard: React.FC = () => {
  // Get UUID
  const [searchParams, setSearchParams] = useSearchParams();
  const UUID = searchParams.get('uuid') || '';
  console.log('UUID: ', UUID);

  const config = {
    xField: 'time',
    yField: 'value',
  };

  const [metricList, setMetricList] = useState([
    { key: 'net_stat.connection_stats', value: 'net_stat.connection_stats' },
  ]);

  const { RangePicker } = DatePicker;

  const NET_CONN_TABLE_CLOUMNS: ColumnsType = [
    {
      title: '文件描述符',
      key: 'fd',
      dataIndex: 'fd',
    },
    {
      title: '地址族',
      key: 'family',
      dataIndex: 'family',
      render: (_, { family }) => {
        let familyName = '';
        if (family === 2) {
          familyName = 'IPv4';
        } else if (family === 10) {
          familyName = 'IPv6';
        } else {
          familyName = 'Other';
        }

        return (
          <>
            <Tag color="blue" key={family}>
              {familyName}
            </Tag>
          </>
        );
      },
    },
    {
      title: '套接字类型',
      key: 'type',
      dataIndex: 'type',
      render: (_, { type }) => {
        let tagContent = '';
        if (type === 1) {
          tagContent = 'TCP';
        } else if (type === 2) {
          tagContent = 'UDP';
        } else if (type === 3) {
          tagContent = 'UNIX';
        } else {
          tagContent = 'UNKNOWN';
        }

        return (
          <>
            <Tag color="magenta" key={type}>
              {tagContent}
            </Tag>
          </>
        );
      },
    },
    {
      title: '本地地址',
      key: 'localaddr',
      dataIndex: 'localaddr',
      render: (_, { localaddr }) => (
        <>
          <Tag color="purple" key={localaddr.ip + localaddr.port}>
            {localaddr.ip + ':' + localaddr.port}
          </Tag>
        </>
      ),
    },
    {
      title: '远程地址',
      key: 'remoteaddr',
      dataIndex: 'remoteaddr',
      render: (_, { remoteaddr }) => (
        <>
          <Tag color="purple" key={remoteaddr.ip + remoteaddr.port}>
            {remoteaddr.ip + ':' + remoteaddr.port}
          </Tag>
        </>
      ),
    },
    {
      title: '套接字状态',
      key: 'status',
      dataIndex: 'status',
      render: (_, { status }) => (
        <>
          <Tag color="cyan" key={status}>
            {status}
          </Tag>
        </>
      ),
    },
    {
      title: '用户标识',
      key: 'uids',
      dataIndex: 'uids',
      render: (_, { uids }) => (
        <>
          {uids.map((flag) => {
            let color = flag.length > 5 ? 'geekblue' : 'green';
            if (flag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={flag}>
                {flag}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: '进程标识',
      key: 'pid',
      dataIndex: 'pid',
      render: (_, { pid }) => (
        <>
          <Tag color="red" key={pid}>
            {pid}
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
    console.log(111)
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
          'net_stat.connection_stats',
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

  return (
    <>
      <Row gutter={0} style={{ marginBottom: '20px' }}>
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
        {...config}
        data={chartList}
        onReady={(plot) => {
          PlotMaps.line = plot;
          plot.on('element:click', (evt: PlotEvent) => {
            console.log(222)
            setTableData(evt, plot);
          });
        }}
        style={{ marginBottom: '50px' }}
      />
      {new Date(selectTime * 1000 + 8 * 60 * 60 * 1000).toISOString() +
        ' 时刻连接状态'}
      {connTableData.length !== 0 && (
        <Table columns={NET_CONN_TABLE_CLOUMNS} dataSource={connTableData} />
      )}
    </>
  );
};

const NetInfoCard: React.FC = () => {
  const [UUID, setUUID] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const uuid = searchParams.get('uuid') || '';
    setUUID(uuid);
  }, []);

  const [netInfo, setNetInfo] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiGetGuestInfos(UUID);
        const parsedNetDesc = JSON.parse(res.netDesc);
        console.log('parsedNetDesc: ', parsedNetDesc.interface_infos);
        setNetInfo(parsedNetDesc.interface_infos);
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
        网卡配置信息
      </div>
      {netInfo.length !== 0 && (
        <Table columns={NET_INFO_TABLE_CLOUMNS} dataSource={netInfo} />
      )}
      <div
        style={{
          fontSize: '20px',
          marginBottom: '20px',
        }}
      >
        网卡流量监测
      </div>
      <NetIOCard />

      <div
        style={{
          fontSize: '20px',
          marginTop: '100px',
          marginBottom: '20px',
        }}
      >
        历史监测信息
      </div>
      <NetStatCard />

      <div
        style={{
          fontSize: '20px',
          marginTop: '100px',
          marginBottom: '20px',
        }}
      >
        连接监测信息
      </div>
      <NetConnStatCard />
    </div>
  );
};


export default NetInfoCard;
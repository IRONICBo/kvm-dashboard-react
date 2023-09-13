/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  apiGetCacheData,
  apiGetGuestInfos,
  apiGetMetricPage,
} from '@/api/Monitor';
import { Base, Line, Plot, PlotEvent } from '@ant-design/plots';
import { useSearchParams } from '@umijs/max';
import { Col, DatePicker, Row, Select, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import translateKey from '../../../utils/translate';

const PARTITION_INFO_TABLE_CLOUMNS: ColumnsType = [
  {
    title: '设备名',
    key: 'device',
    dataIndex: 'device',
    width: '150px',
  },
  {
    title: '挂载点',
    key: 'mountpoint',
    dataIndex: 'mountpoint',
    render: (_, { mountpoint }) => (
      <>
        {mountpoint ? (
          <Tag color="blue" key={mountpoint}>
            {mountpoint}
          </Tag>
        ) : (
          <Tag color="volcano" key={mountpoint}>
            未知
          </Tag>
        )}
      </>
    ),
  },
  {
    title: '文件系统类型',
    key: 'fstype',
    dataIndex: 'fstype',
    render: (_, { fstype }) => (
      <>
        {fstype ? (
          <Tag color="cyan" key={fstype}>
            {fstype}
          </Tag>
        ) : (
          <Tag color="volcano" key={fstype}>
            未知
          </Tag>
        )}
      </>
    ),
  },
  {
    title: '选项',
    key: 'opts',
    dataIndex: 'opts',
    render: (_, { opts }) => {
      const optsList = opts.split(',');
      return (
        <>
          {optsList.map((item) => (
            <Tag color="green" key={item}>
              {item}
            </Tag>
          ))}
        </>
      );
    },
  },
];

const DiskLoadStatCard: React.FC = () => {
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
  const statType = 'disk_stat';
  const [diskPercentStat, setDiskPercentStat] = useState([]);
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
      const tempMemPercentStat = [];
      // change data format, get value and time
      const ioItem = JSON.parse(msg.data);
      // time => timestamp, interfaces => key, value => send_bytes

      // Object.keys(ioItem).forEach((key) => {
      //   if (key !== 'timestamp') {
      //     setDiskPercentStat.push({
      //       time: new Date(
      //         ioItem.timestamp * 1000 + 8 * 60 * 60 * 1000,
      //       ).toISOString(),
      //       interfaces: key,
      //       value: ioItem[key].bytes_sent,
      //     });
      //   }
      // });

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
        const statType = 'disk_stat';
        const res = await apiGetCacheData(statType, UUID);
        console.log('parsedDiskStat: ', res);

        const tempDiskPercentStat:
          | ((prevState: never[]) => never[])
          | { time: string; name: string; value: number }[] = [];
        // change data format, get value and time
        res.forEach((element) => {
          const diskItem = JSON.parse(element);
          // time => timestamp, interfaces => key, value => send_bytes

          Object.keys(diskItem).forEach((key) => {
            // TODO: Modify statType
            // TODO: Modify statType
            // TODO: Modify statType
            if (key !== 'timestamp') {
              diskItem.list.forEach((item) => {
                // if (parseFloat(item.usedPercent) < 0.1) {
                //   return;
                // }
                tempDiskPercentStat.push({
                  time: new Date(
                    diskItem.timestamp * 1000 + 8 * 60 * 60 * 1000,
                  ).toISOString(),
                  name: item.mountpoint,
                  value: parseFloat(item.usedPercent),
                });
              });
            }
          });
        });

        setDiskPercentStat(tempDiskPercentStat);
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
    yAxis: {
      nice: true,
    },
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <Line {...config} data={diskPercentStat} />
        </Col>
      </Row>
    </>
  );
};

const DiskTimeStatCard: React.FC = () => {
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
    {
      key: 'disk_stat.partition_with_usage_stats',
      value: translateKey('disk_stat.partition_with_usage_stats'),
    },
  ]);

  const { RangePicker } = DatePicker;

  const DISK_TABLE_CLOUMNS: ColumnsType = [
    {
      title: '设备',
      key: 'device',
      dataIndex: 'device',
      width: '150px',
      fixed: 'left',
    },
    {
      title: '挂载点',
      key: 'mountpoint',
      dataIndex: 'mountpoint',
      width: '150px',
      render: (_, { mountpoint }) => (
        <>
          <Tag color="magenta" key={mountpoint}>
            {mountpoint}
          </Tag>
        </>
      ),
    },
    {
      title: '文件系统类型',
      key: 'fstype',
      dataIndex: 'fstype',
      width: '150px',
      render: (_, { fstype }) => (
        <>
          <Tag color="magenta" key={fstype}>
            {fstype}
          </Tag>
        </>
      ),
    },
    {
      title: '选项',
      key: 'opts',
      dataIndex: 'opts',
      width: '300px',
      render: (_, { opts }) => {
        const optsList = opts.split(',');
        return (
          <>
            {optsList.map((item) => (
              <Tag color="green" key={item}>
                {item}
              </Tag>
            ))}
          </>
        );
      },
    },
    {
      title: '路径',
      key: 'path',
      dataIndex: 'path',
      width: '150px',
      render: (_, { path }) => (
        <>
          <Tag color="blue" key={path}>
            {path}
          </Tag>
        </>
      ),
    },
    {
      title: '总空间',
      key: 'total',
      dataIndex: 'total',
      width: '150px',
      render: (_, { total }) => (
        <>
          <Tag color="blue" key={total}>
            {total}
          </Tag>
        </>
      ),
    },
    {
      title: '可用空间',
      key: 'free',
      dataIndex: 'free',
      width: '150px',
      render: (_, { free }) => (
        <>
          <Tag color="green" key={free}>
            {free}
          </Tag>
        </>
      ),
    },
    {
      title: '已使用空间',
      key: 'used',
      dataIndex: 'used',
      width: '150px',
      render: (_, { used }) => (
        <>
          <Tag color="green" key={used}>
            {used}
          </Tag>
        </>
      ),
    },
    {
      title: '已使用百分比',
      key: 'usedPercent',
      dataIndex: 'usedPercent',
      width: '300px',
      render: (_, { usedPercent }) => (
        <>
          <Tag color="red" key={usedPercent}>
            {usedPercent}
          </Tag>
        </>
      ),
    },
    {
      title: '总索引节点数',
      key: 'inodesTotal',
      dataIndex: 'inodesTotal',
      width: '150px',
      render: (_, { inodesTotal }) => (
        <>
          <Tag color="purple" key={inodesTotal}>
            {inodesTotal}
          </Tag>
        </>
      ),
    },
    {
      title: '已使用索引节点数',
      key: 'inodesUsed',
      dataIndex: 'inodesUsed',
      width: '150px',
      render: (_, { inodesUsed }) => (
        <>
          <Tag color="purple" key={inodesUsed}>
            {inodesUsed}
          </Tag>
        </>
      ),
    },
    {
      title: '可使用索引节点数',
      key: 'inodesFree',
      dataIndex: 'inodesFree',
      width: '150px',
      render: (_, { inodesFree }) => (
        <>
          <Tag color="purple" key={inodesFree}>
            {inodesFree}
          </Tag>
        </>
      ),
    },
    {
      title: '已使用索引节点百分比',
      key: 'inodesUsedPercent',
      dataIndex: 'inodesUsedPercent',
      width: '300px',
      render: (_, { inodesUsedPercent }) => (
        <>
          <Tag color="purple" key={inodesUsedPercent}>
            {inodesUsedPercent}
          </Tag>
        </>
      ),
    },
    {
      title: '读取次数',
      key: 'read_count',
      dataIndex: 'read_count',
      width: '150px',
      render: (_, { read_count }) => (
        <>
          <Tag color="purple" key={read_count}>
            {read_count}
          </Tag>
        </>
      ),
    },
    {
      title: '合并读取次数',
      key: 'merged_read_count',
      dataIndex: 'merged_read_count',
      width: '150px',
      render: (_, { merged_read_count }) => (
        <>
          <Tag color="purple" key={merged_read_count}>
            {merged_read_count}
          </Tag>
        </>
      ),
    },
    {
      title: '写入次数',
      key: 'write_count',
      dataIndex: 'write_count',
      width: '150px',
      render: (_, { write_count }) => (
        <>
          <Tag color="purple" key={write_count}>
            {write_count}
          </Tag>
        </>
      ),
    },
    {
      title: '合并写入次数',
      key: 'merged_write_count',
      dataIndex: 'merged_write_count',
      width: '150px',
      render: (_, { merged_write_count }) => (
        <>
          <Tag color="purple" key={merged_write_count}>
            {merged_write_count}
          </Tag>
        </>
      ),
    },
    {
      title: '读取字节数',
      key: 'read_bytes',
      dataIndex: 'read_bytes',
      width: '150px',
      render: (_, { read_bytes }) => (
        <>
          <Tag color="purple" key={read_bytes}>
            {read_bytes}
          </Tag>
        </>
      ),
    },
    {
      title: '写入字节数',
      key: 'write_bytes',
      dataIndex: 'write_bytes',
      width: '150px',
      render: (_, { write_bytes }) => (
        <>
          <Tag color="purple" key={write_bytes}>
            {write_bytes}
          </Tag>
        </>
      ),
    },
    {
      title: '读取时间',
      key: 'read_time',
      dataIndex: 'read_time',
      width: '150px',
      render: (_, { read_time }) => (
        <>
          <Tag color="purple" key={read_time}>
            {read_time}
          </Tag>
        </>
      ),
    },
    {
      title: '写入时间',
      key: 'write_time',
      dataIndex: 'write_time',
      width: '150px',
      render: (_, { write_time }) => (
        <>
          <Tag color="purple" key={write_time}>
            {write_time}
          </Tag>
        </>
      ),
    },
    {
      title: '进行中的每秒的读写次数',
      key: 'iops_in_progress',
      dataIndex: 'iops_in_progress',
      width: '150px',
      render: (_, { iops_in_progress }) => (
        <>
          <Tag color="purple" key={iops_in_progress}>
            {iops_in_progress}
          </Tag>
        </>
      ),
    },
    {
      title: '输入输出时间',
      key: 'io_time',
      dataIndex: 'io_time',
      width: '150px',
      render: (_, { io_time }) => (
        <>
          <Tag color="purple" key={io_time}>
            {io_time}
          </Tag>
        </>
      ),
    },
    {
      title: '加权输入输出',
      key: 'weighted_io',
      dataIndex: 'weighted_io',
      width: '150px',
      render: (_, { weighted_io }) => (
        <>
          <Tag color="purple" key={weighted_io}>
            {weighted_io}
          </Tag>
        </>
      ),
    },
    {
      title: '名称',
      key: 'name',
      dataIndex: 'name',
      width: '150px',
      render: (_, { name }) => (
        <>
          <Tag color="purple" key={name}>
            {name}
          </Tag>
        </>
      ),
    },
    {
      title: '序列号',
      key: 'serial_number',
      dataIndex: 'serial_number',
      width: '150px',
      render: (_, { serial_number }) => (
        <>
          <Tag color="purple" key={serial_number}>
            {serial_number}
          </Tag>
        </>
      ),
    },
    {
      title: '标签',
      key: 'label',
      dataIndex: 'label',
      width: '150px',
      render: (_, { label }) => (
        <>
          <Tag color="purple" key={label}>
            {label}
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
          'disk_stat.partition_with_usage_stats',
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
            setTableData(evt, plot);
          });
        }}
        style={{ marginBottom: '50px' }}
      />
      {new Date(selectTime * 1000 + 8 * 60 * 60 * 1000).toISOString() +
        ' 时刻分区状态'}
      {connTableData.length !== 0 && (
        <Table
          columns={DISK_TABLE_CLOUMNS}
          scroll={{ x: 1500 }}
          dataSource={connTableData}
        />
      )}
    </>
  );
};

const DiskInfoCard: React.FC = () => {
  const [UUID, setUUID] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const uuid = searchParams.get('uuid') || '';
    setUUID(uuid);
  }, []);

  const [partInfo, setPartInfo] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiGetGuestInfos(UUID);
        const parsedDiskDesc = JSON.parse(res.diskDesc);
        console.log('partition_stats: ', parsedDiskDesc.partition_stats);
        setPartInfo(parsedDiskDesc.partition_stats);
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
        分区状态
      </div>
      {partInfo.length !== 0 && (
        <Table columns={PARTITION_INFO_TABLE_CLOUMNS} dataSource={partInfo} />
      )}
      <div
        style={{
          fontSize: '20px',
          marginBottom: '20px',
        }}
      >
        分区占用
      </div>
      <DiskLoadStatCard />

      <div
        style={{
          fontSize: '20px',
          marginTop: '100px',
          marginBottom: '20px',
        }}
      >
        分区指标信息
      </div>
      <DiskTimeStatCard />
    </div>
  );
};

export default DiskInfoCard;

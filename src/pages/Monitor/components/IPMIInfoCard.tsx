/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  apiGetCacheData,
  apiGetGuestInfos,
  apiGetKeySet,
  apiGetMetricAgg,
  apiGetMetricPage,
} from '@/api/Monitor';
import { apiQueryIPMILog } from '@/api/IPMI'
import { Area, Base, Line, Plot, PlotEvent } from '@ant-design/plots';
import { useSearchParams } from '@umijs/max';
import { Col, DatePicker, Radio, Row, Select, Table, Tag, Button } from 'antd';
import { CloudDownloadOutlined } from '@ant-design/icons';
import ExportJsonExcel from "js-export-excel";
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import translateKey from '../../../utils/translate';

const IPMIStatCard: React.FC = () => {
  // Get UUID
  const [searchParams, setSearchParams] = useSearchParams();
  const UUID = searchParams.get('uuid') || '';
  const IPMI = searchParams.get('ipmi') || '';
  console.log('UUID: ', UUID);

  const config = {
    xField: 'time',
    yField: 'value',
  };

  const [metricList, setMetricList] = useState([
    { key: 'ipmi', value: translateKey('ipmi') },
  ]);

  const { RangePicker } = DatePicker;

  const IPMI_TABLE_CLOUMNS: ColumnsType = [
    {
      title: '传感器',
      key: 'name',
      dataIndex: 'name',
      width: '150px',
      fixed: 'left',
    },
    {
      title: '低不可恢复',
      key: 'nonrecoverable_alarm_low',
      dataIndex: 'nonrecoverable_alarm_low',
      width: '150px',
      render: (_, { nonrecoverable_alarm_low }) => (
          <>
            <Tag color="magenta" key={nonrecoverable_alarm_low}>
              {nonrecoverable_alarm_low}
            </Tag>
          </>
        ),
    },
    {
      title: '低临界',
      key: 'critical_alarm_low',
      dataIndex: 'critical_alarm_low',
      width: '150px',
      render: (_, { critical_alarm_low }) => (
        <>
          <Tag color="magenta" key={critical_alarm_low}>
            {critical_alarm_low}
          </Tag>
        </>
      ),
    },
    {
      title: '低警告',
      key: 'warning_alarm_low',
      dataIndex: 'warning_alarm_low',
      width: '150px',
      render: (_, { warning_alarm_low }) => (
        <>
          <Tag color="magenta" key={warning_alarm_low}>
            {warning_alarm_low}
          </Tag>
        </>
      ),
    },
    {
      title: '当前',
      key: 'value',
      dataIndex: 'value',
      width: '150px',
      render: (_, { value }) => (
        <>
          <Tag color="magenta" key={value}>
            {value}
          </Tag>
        </>
      ),
    },
    {
      title: '高不可恢复',
      key: 'nonrecoverable_alarm_high',
      dataIndex: 'nonrecoverable_alarm_high',
      width: '150px',
      render: (_, { nonrecoverable_alarm_high }) => (
          <>
            <Tag color="magenta" key={nonrecoverable_alarm_high}>
              {nonrecoverable_alarm_high}
            </Tag>
          </>
        ),
    },
    {
      title: '高临界',
      key: 'critical_alarm_high',
      dataIndex: 'critical_alarm_high',
      width: '150px',
      render: (_, { critical_alarm_high }) => (
        <>
          <Tag color="magenta" key={critical_alarm_high}>
            {critical_alarm_high}
          </Tag>
        </>
      ),
    },
    {
      title: '高警告',
      key: 'warning_alarm_high',
      dataIndex: 'warning_alarm_high',
      width: '150px',
      render: (_, { warning_alarm_high }) => (
        <>
          <Tag color="magenta" key={warning_alarm_high}>
            {warning_alarm_high}
          </Tag>
        </>
      ),
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      width: '150px',
      render: (_, { status }) => (
        <>
          <Tag color="magenta" key={status}>
            {status}
          </Tag>
        </>
      ),
    },
    {
      title: '单位',
      key: 'unit',
      dataIndex: 'unit',
      width: '150px',
      render: (_, { unit }) => (
        <>
          <Tag color="magenta" key={unit}>
            {unit}
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
      tempConnTableData = tempConnTableData.sensor_data_list.sensor_data
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
          'ipmi',
          10,
          0,
          selectedStartTime,
          IPMI,
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
      fileName:translateKey('ipmi'),
      datas:[],
    };
    const tempConnTableData = connTableData;
    option.datas = [
      {
        sheetData: tempConnTableData,
        sheetName: "监测指标",
        sheetFilter: ["name", "nonrecoverable_alarm_low", "critical_alarm_low", "warning_alarm_low", "value", "nonrecoverable_alarm_high", "critical_alarm_high", "warning_alarm_high", "status", "unit"],
        sheetHeader: ["传感器", "低不可恢复", "低临界", "低警告", "当前", "高不可恢复", "高临界", "高警告", "状态", "单位"],
        columnWidths: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
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
      <Area
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
        ' 时刻连接状态'}
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
        <Table columns={IPMI_TABLE_CLOUMNS} scroll={{ x: 1500 }} dataSource={connTableData} />
      )}
    </>
  );
};

const IPMILogCard: React.FC = () => {
  // Get UUID
  const [searchParams, setSearchParams] = useSearchParams();
  const UUID = searchParams.get('uuid') || '';
  const IPMI = searchParams.get('ipmi') || '';
  console.log('UUID: ', UUID);

  const config = {
    xField: 'time',
    yField: 'value',
  };

  const [metricList, setMetricList] = useState([
    { key: 'ipmi', value: translateKey('ipmi') },
  ]);

  const { RangePicker } = DatePicker;

  const IPMI_TABLE_CLOUMNS: ColumnsType = [
    {
      title: '索引',
      key: 'id',
      dataIndex: 'id',
      width: '150px',
      fixed: 'left',
    },
    {
      title: '日期',
      key: 'date',
      dataIndex: 'date',
      width: '150px',
      render: (_, { date }) => (
          <>
            <Tag color="magenta" key={date}>
              {date}
            </Tag>
          </>
        ),
    },
    {
      title: '时刻',
      key: 'time',
      dataIndex: 'time',
      width: '150px',
      render: (_, { time }) => (
        <>
          <Tag color="magenta" key={time}>
            {time}
          </Tag>
        </>
      ),
    },
    {
      title: '事件',
      key: 'event',
      dataIndex: 'event',
      width: '150px',
      render: (_, { event }) => (
        <>
          <Tag color="magenta" key={event}>
            {event}
          </Tag>
        </>
      ),
    },
    {
      title: '描述',
      key: 'desc',
      dataIndex: 'desc',
      width: '150px',
      render: (_, { desc }) => (
        <>
          <Tag color="magenta" key={desc}>
            {desc}
          </Tag>
        </>
      ),
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      width: '150px',
      render: (_, { status }) => (
          <>
            <Tag color="magenta" key={status}>
              {status}
            </Tag>
          </>
        ),
    },
  ];

  const [chartList, selectChartList] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [connTableData, setConnTableData] = useState([]);
  const [selectTime, setSelectTime] = useState(0);

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
      tempConnTableData = tempConnTableData.sensor_data_list.sensor_data
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

        const parts = IPMI.split(":");
        if (parts.length < 2) {
          return;
        }
        const host = parts[0]
        const port = parts[1]
        const res = await apiQueryIPMILog(
          host,
          port,
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
  }, [IPMI]);

  const downloadExcel = () => {
    var option:any = {
      fileName:translateKey('ipmi'),
      datas:[],
    };
    const tempConnTableData = connTableData;
    option.datas = [
      {
        sheetData: tempConnTableData,
        sheetName: "监测指标",
        sheetFilter: ["id", "date", "time", "event", "desc", "status"],
        sheetHeader: ["索引", "日期", "时刻", "事件", "描述", "状态"],
        columnWidths: [30, 30, 30, 30, 30, 30],
      },
    ];
    var toExcel = new ExportJsonExcel(option); //new
    toExcel.saveExcel(); //保存
  }


  return (
    <>
      <div style={{
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
      }}>
      {new Date(selectTime * 1000 + 8 * 60 * 60 * 1000).toISOString() +
        ' 时刻日志状态'}
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
        <Table columns={IPMI_TABLE_CLOUMNS} scroll={{ x: 1500 }} dataSource={connTableData} />
      )}
    </>
  );
};

const IPMICard: React.FC = () => {
  const [UUID, setUUID] = useState('');
  const [IPMI, setIPMI] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const uuid = searchParams.get('uuid') || '';
    const ipmi = searchParams.get('ipmi') || '';
    setUUID(uuid);
    setUUID(ipmi);
  }, []);

  return (
    <div>
      <div
        style={{
          fontSize: '20px',
          marginBottom: '20px',
        }}
      >
        智能管理平台接口信息
      </div>
      <IPMIStatCard />
      
      <div
        style={{
          fontSize: '20px',
          marginBottom: '20px',
        }}
      >
        智能管理平台接口日志
      </div>
      <IPMILogCard />
    </div>
  );
};


export default IPMICard;
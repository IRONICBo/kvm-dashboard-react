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
import { Col, DatePicker, Radio, Row, Select, Table, Tag, Button } from 'antd';
import { CloudDownloadOutlined } from '@ant-design/icons';
import ExportJsonExcel from "js-export-excel";
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import translateKey from '../../../utils/translate';

const SNMPStatCard: React.FC = () => {
  // Get UUID
  const [searchParams, setSearchParams] = useSearchParams();
  const UUID = searchParams.get('uuid') || '';
  const SNMP = searchParams.get('snmp') || '';
  console.log('UUID: ', UUID);

  const config = {
    xField: 'time',
    yField: 'value',
  };

  const [metricList, setMetricList] = useState([
    { key: 'SNMP', value: translateKey('snmp') },
  ]);

  const { RangePicker } = DatePicker;

  const SNMP_TABLE_CLOUMNS: ColumnsType = [
    {
      title: '指标名',
      key: 'name',
      dataIndex: 'name',
      width: '100px',
      fixed: 'left',
    },
    {
      title: '标识',
      key: 'oid',
      dataIndex: 'oid',
      width: '300px',
      render: (_, { oid }) => (
          <>
            <Tag color="magenta" key={oid}>
              {oid}
            </Tag>
          </>
        ),
    },
    {
      title: '采集值',
      key: 'value',
      dataIndex: 'value',
      width: '300px',
      render: (_, { value }) => (
        <>
          <Tag color="magenta" key={value}>
            {value}
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
      tempConnTableData = tempConnTableData.oid_instance_map_list.oid_instance_map
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
          'snmp',
          10,
          0,
          selectedStartTime,
          SNMP,
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
      fileName:translateKey('snmp'),
      datas:[],
    };
    const tempConnTableData = connTableData;
    option.datas = [
      {
        sheetData: tempConnTableData,
        sheetName: "监测指标",
        sheetFilter: ["name", "oid", "value"],
        sheetHeader: ["指标名", "标识", "采集值"],
        columnWidths: [30, 50, 30],
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
        <Table columns={SNMP_TABLE_CLOUMNS} scroll={{ x: 1500 }} dataSource={connTableData} />
      )}
    </>
  );
};

const SNMPCard: React.FC = () => {
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
        简单网络协议信息
      </div>
      <SNMPStatCard />
    </div>
  );
};


export default SNMPCard;
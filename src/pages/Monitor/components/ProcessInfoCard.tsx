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

const ProcessStatCard: React.FC = () => {
  // Get UUID
  const [searchParams, setSearchParams] = useSearchParams();
  const UUID = searchParams.get('uuid') || '';
  console.log('UUID: ', UUID);

  const config = {
    xField: 'time',
    yField: 'value',
  };

  const [metricList, setMetricList] = useState([
    { key: 'process_stat.processes', value: translateKey('process_stat.processes') },
  ]);

  const { RangePicker } = DatePicker;

  const PROCESS_TABLE_CLOUMNS: ColumnsType = [
    {
      title: '进程标识符',
      key: 'pid',
      dataIndex: 'pid',
      width: '150px',
      fixed: 'left',
    },
    {
      title: '进程名称',
      key: 'name',
      dataIndex: 'name',
      width: '300px',
      fixed: 'left',
      render: (_, { name }) => (
          <>
            <Tag color="magenta" key={name}>
              {name}
            </Tag>
          </>
        ),
    },
    {
      title: '进程状态',
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
      title: '父进程标识符',
      key: 'parent',
      dataIndex: 'parent',
      width: '300px',
      render: (_, { parent }) => (
        <>
          <Tag color="magenta" key={parent}>
            {parent}
          </Tag>
        </>
      ),
    },
    {
      title: '上下文切换次数的统计信息',
      key: 'num_ctx_switches',
      dataIndex: 'num_ctx_switches',
      width: '150px',
      render: (_, { num_ctx_switches }) => {
        return (
          <>
            <Tag color="blue" key={num_ctx_switches.voluntary}>
              主动：{num_ctx_switches.voluntary}
            </Tag>
            <Tag color="blue" key={num_ctx_switches.involuntary}>
              非主动：{num_ctx_switches.involuntary}
            </Tag>
          </>
        );
      },
    },
    {
      title: '用户标识符列表',
      key: 'uids',
      dataIndex: 'uids',
      width: '150px',
      render: (_, { uids }) => (
        <>
          <Tag color="blue" key={uids}>
            {uids}
          </Tag>
        </>
      ),
    },
    {
      title: '用户组标识符列表',
      key: 'gids',
      dataIndex: 'gids',
      width: '150px',
      render: (_, { gids }) => (
        <>
          <Tag color="green" key={gids}>
            {gids}
          </Tag>
        </>
      ),
    },
    {
      title: '所属组列表',
      key: 'groups',
      dataIndex: 'groups',
      width: '150px',
      render: (_, { groups }) => (
        <>
          <Tag color="green" key={groups}>
            {groups}
          </Tag>
        </>
      ),
    },
    {
      title: '线程数量',
      key: 'num_threads',
      dataIndex: 'num_threads',
      width: '150px',
      render: (_, { num_threads }) => (
        <>
          <Tag color="green" key={num_threads}>
            {num_threads}
          </Tag>
        </>
      ),
    },
    {
      title: '内存信息的统计信息',
      key: 'mem_info',
      dataIndex: Date.now() + 'mem_info',
      width: '200px',
      render: (_, { mem_info }) => (
        <div key={Date.now()}>
          <Tag color="green" key={Date.now() +mem_info.rss}>
          常驻内存：{mem_info.rss}
          </Tag>
          <Tag color="green" key={Date.now() + mem_info.vms}>
          虚拟内存：{mem_info.vms}
          </Tag>
          <Tag color="green" key={Date.now() + mem_info.hwm}>
          峰值常驻内存：{mem_info.hwm}
          </Tag>
          <Tag color="green" key={Date.now() + mem_info.data}>
          数据段：{mem_info.data}
          </Tag>
          <Tag color="green" key={Date.now() + mem_info.stack}>
          栈：{mem_info.stack}
          </Tag>
          <Tag color="green" key={Date.now() + mem_info.locked}>
          锁定内存：{mem_info.locked}
          </Tag>
          <Tag color="green" key={Date.now() + mem_info.swap}>
          交换内存：{mem_info.swap}
          </Tag>
        </div>
      ),
    },
    // {
    //   title: '信号信息的统计信息',
    //   key: 'sig_info',
    //   dataIndex: 'sig_info',
    //   width: '200px',
    //   render: (_, { sig_info }) => (
    //     <>
    //       <Tag color="blue" key={sig_info.pending_process}>
    //       待处理的进程信号数量：{sig_info.pending_process}
    //       </Tag>
    //       <Tag color="blue" key={sig_info.pending_thread}>
    //       待处理的线程信号数量：{sig_info.pending_thread}
    //       </Tag>
    //       <Tag color="blue" key={sig_info.blocked}>
    //       被阻塞的信号数量：{sig_info.blocked}
    //       </Tag>
    //       <Tag color="blue" key={sig_info.ignored}>
    //       被忽略的信号数量：{sig_info.ignored}
    //       </Tag>
    //       <Tag color="blue" key={sig_info.caught}>
    //       已捕获的信号数量：{sig_info.caught}
    //       </Tag>
    //     </>
    //   ),
    // },
    {
      title: '进程创建时间的时间戳',
      key: 'create_time',
      dataIndex: 'create_time',
      width: '150px',
      render: (_, { create_time }) => (
        <>
          <Tag color="green" key={create_time}>
            {create_time}
          </Tag>
        </>
      ),
    },
    // {
    //   title: '上次处理器时间的统计信息',
    //   key: 'last_cpu_times',
    //   dataIndex: 'last_cpu_times',
    //   width: '150px',
    //   render: (_, { last_cpu_times }) => (
    //     <>
    //       {last_cpu_times != null && (
    //                 <>
    //         <Tag color="green" key={last_cpu_times.cpu}>
    //         处理器的标识：{last_cpu_times.cpu}
    //         </Tag>
    //         <Tag color="green" key={last_cpu_times.user}>
    //         用户态处理器时间：{last_cpu_times.user}
    //         </Tag>
    //         <Tag color="green" key={last_cpu_times.system}>
    //         内核态处理器时间：{last_cpu_times.system}
    //         </Tag>
    //         <Tag color="green" key={last_cpu_times.idle}>
    //         空闲处理器时间：{last_cpu_times.idle}
    //         </Tag>
    //         <Tag color="green" key={last_cpu_times.nice}>
    //         低优先级用户态处理器时间：{last_cpu_times.nice}
    //         </Tag>
    //         <Tag color="green" key={last_cpu_times.iowait}>
    //         等待 I/O 的处理器时间：{last_cpu_times.iowait}
    //         </Tag>
    //         <Tag color="green" key={last_cpu_times.irq}>
    //         处理中断的处理器时间：{last_cpu_times.irq}
    //         </Tag>
    //         <Tag color="green" key={last_cpu_times.softirq}>
    //         处理软中断的处理器时间：{last_cpu_times.softirq}
    //         </Tag>
    //         <Tag color="green" key={last_cpu_times.steal}>
    //         被虚拟化环境偷取的处理器时间：{last_cpu_times.steal}
    //         </Tag>
    //         <Tag color="green" key={last_cpu_times.guest}>
    //         运行虚拟机的处理器时间：{last_cpu_times.guest}
    //         </Tag>
    //         <Tag color="green" key={last_cpu_times.guest_nice}>
    //         运行低优先级虚拟机的处理器时间：{last_cpu_times.guest_nice}
    //         </Tag>
    //         </>
    //       )}
    //     </>
    //   ),
    // },
    {
      title: '上次处理器时间的时间戳',
      key: 'last_cpu_time',
      dataIndex: 'last_cpu_time',
      width: '300px',
      render: (_, { last_cpu_time }) => (
        <>
          <Tag color="green" key={last_cpu_time}>
            {last_cpu_time}
          </Tag>
        </>
      ),
    },
    {
      title: '线程组标识符',
      key: 'tgid',
      dataIndex: 'tgid',
      width: '150px',
      render: (_, { tgid }) => (
        <>
          <Tag color="green" key={tgid}>
            {tgid}
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
          'process_stat.processes',
          10,
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
      fileName:translateKey('process_stat.processes'),
      datas:[],
    };
    const tempConnTableData = connTableData;
    tempConnTableData.forEach((item) => {
      item.num_ctx_switches = "主动："+item.num_ctx_switches.voluntary + '/非主动：' + item.num_ctx_switches.involuntary;
      item.mem_info = "常驻内存："+item.mem_info.rss + '/虚拟内存：' + item.mem_info.vms + '/峰值常驻内存：' + item.mem_info.hwm + '/数据段：' + item.mem_info.data + '/栈：' + item.mem_info.stack + '/锁定内存：' + item.mem_info.locked + '/交换内存：' + item.mem_info.swap;
    });
    option.datas = [
      {
        sheetData: tempConnTableData,
        sheetName: "监测指标",
        sheetFilter: ["pid", "name", "status", "parent", "num_ctx_switches", "uids", "gids", "groups", "num_threads", "mem_info", "create_time", "last_cpu_time", "tgid"],
        sheetHeader: ["进程标识符", "进程名称", "进程状态", "父进程标识符", "上下文切换次数的统计信息", "用户标识符列表", "用户组标识符列表", "所属组列表", "线程数量", "内存信息的统计信息", "进程创建时间的时间戳", "上次处理器时间的时间戳", "线程组标识符"],
        columnWidths: [30, 30, 30, 30, 30, 30, 30, 30, 30, 50, 30, 30, 30],
      },
    ];
    var toExcel = new ExportJsonExcel(option); //new
    toExcel.saveExcel(); //保存
  }


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
      <Area
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
        <Table columns={PROCESS_TABLE_CLOUMNS} scroll={{ x: 1500 }} dataSource={connTableData} />
      )}
    </>
  );
};

const ProcessInfoCard: React.FC = () => {
  const [UUID, setUUID] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const uuid = searchParams.get('uuid') || '';
    setUUID(uuid);
  }, []);

  return (
    <div>
      <div
        style={{
          fontSize: '20px',
          marginBottom: '20px',
        }}
      >
        进程监测信息
      </div>
      <ProcessStatCard />
    </div>
  );
};


export default ProcessInfoCard;
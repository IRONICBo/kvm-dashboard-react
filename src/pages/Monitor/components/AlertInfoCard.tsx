/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { apiGetAlertPage, apiGetMachineAlertPage } from '@/api/Monitor';
import { useSearchParams } from '@umijs/max';
import { ProDescriptions } from '@ant-design/pro-components';
import { Col, DatePicker, Radio, Row, Select, Table, Tag, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';

const ALERT_INFO_CLOUMNS = [
  {
    title: '报警序列号',
    key: 'alarmZzid',
    dataIndex: 'alarmZzid'
  },
  {
    title: '报警节点序列号',
    key: 'alarmMachineUuid',
    dataIndex: 'alarmMachineUuid',
    render: (_, { alarmMachineUuid }) => (
      <>
          <Tag color="blue" key={alarmMachineUuid}>
            {alarmMachineUuid}
          </Tag>
      </>
    ),
    width: 200,
  },
  {
    title: '报警标签',
    key: 'alarmTargetTag',
    dataIndex: 'alarmTargetTag',
    render: (_, { alarmTargetTag }) => (
      <>
        {alarmTargetTag.length > 7 ? (
          <Tag color="green" key={alarmTargetTag}>
            {alarmTargetTag}
          </Tag>
        ) : (
          <Tag color="volcano" key={alarmTargetTag}>
            {alarmTargetTag}
          </Tag>
        )}
      </>
    ),
  },
  {
    title: '报警信息',
    key: 'alarmValue',
    dataIndex: 'alarmValue',
    render: (_, { alarmValue }) => (
      <Tooltip placement="topLeft" title={alarmValue}>
        {alarmValue.length > 7 ? `${alarmValue.substring(0, 40)}...` : alarmValue}
      </Tooltip>
    ),
  },
  {
    title: '报警开始时间',
    key: 'alarmBeginTime',
    dataIndex: 'alarmBeginTime',
  },
  {
    title: '报警结束时间',
    key: 'alarmEndTime',
    dataIndex: 'alarmEndTime',
  },
];

interface HostIdProps {
  uuid: string;
}
const AlertInfoCard: React.FC<HostIdProps> = (props) => {
  interface AlertInfo {
    alarmZzid: number;
    alarmMachineUuid: string;
    alarmTargetTag: string;
    alarmValue: string;
    alarmBeginTime: string;
    alarmEndTime: string;
  }
  // const UUID = props.uuid;
  //
  const [searchParams, setSearchParams] = useSearchParams();
  const UUID = searchParams.get('uuid') || '';
  console.log("Alert UUID", UUID)
  const [alertInfo, setAlertInfo] = useState([]);

  const [alertCurrent, setAlertCurrent] = useState(1);
  // total columns
  const [alertTotal, setAlertTotal] = useState(100);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiGetMachineAlertPage(UUID, alertCurrent, 10);
        // console.log('res.records: ', res.records);
        // Do not need to parse
        // const parsedAlertInfo = res.records;
        const parsedAlertInfo = res;
        console.log('parsedAlertInfo: ', parsedAlertInfo);
        // Maybe some data need to be parsed
        setAlertInfo(parsedAlertInfo);
        setAlertTotal(res.total);

      } catch (error) {
        console.error('Error retrieving guest infos:', error);
      }
    };

    fetchData();
  }, [UUID, alertCurrent]);

  console.log('alertInfo: ', alertInfo);

  return (
    <>
      { alertInfo != undefined && alertInfo.length !== 0 && (
        <Table columns={ALERT_INFO_CLOUMNS} dataSource={alertInfo} pagination={{ current: alertCurrent, total: alertTotal, onChange(page, pageSize) {
          setAlertCurrent(page)
        }, }}/>
      )}
    </>
  );
};


export default AlertInfoCard;
export const websocket = new WebSocket(
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

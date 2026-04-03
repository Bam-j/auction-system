import {useState, useEffect} from 'react';

import {Card, CardBody, Typography, Button, ButtonGroup} from '@material-tailwind/react';
import {
  CurrencyDollarIcon, HandRaisedIcon, CheckCircleIcon,
  XCircleIcon, BoltIcon, EnvelopeIcon, NoSymbolIcon, FlagIcon
} from '@heroicons/react/24/outline';
import {
  ComposedChart, Line, Bar,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';

//절대 경로 모듈
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {getAuctionStats} from '@/features/admin/api/dashboardApi';

const AuctionStatsView = () => {
  const [period, setPeriod] = useState(7);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await getAuctionStats(period);
        setStats(response.data);
      } catch (error) {
        console.error('경매 통계 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [period]);

  if (loading) return <LoadingSpinner/>;
  if (!stats) return <div className='p-10 text-center'>통계 데이터를 불러올 수 없습니다.</div>;

  const statsSummary = [
    {label: '등록 경매', value: stats.todayRegisteredAuctions, icon: CurrencyDollarIcon, color: 'blue'},
    {label: '등록 입찰', value: stats.todayRegisteredBids, icon: HandRaisedIcon, color: 'indigo'},
    {label: '마감 경매', value: stats.todayClosedAuctions, icon: FlagIcon, color: 'gray'},
    {label: '낙찰 완료', value: stats.todayWonAuctions, icon: CheckCircleIcon, color: 'green'},
    {label: '경매 실패', value: stats.todayFailedAuctions, icon: XCircleIcon, color: 'red'},
    {label: '즉시 구매', value: stats.todayInstantBoughtAuctions, icon: BoltIcon, color: 'amber'},
    {label: '구매 요청', value: stats.todaySentInstantBuyRequests, icon: EnvelopeIcon, color: 'deep-orange'},
    {label: '요청 거절', value: stats.todayRejectedInstantBuyRequests, icon: NoSymbolIcon, color: 'brown'},
  ];

  return (
      <div className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {statsSummary.map((stat) => (
              <Card key={stat.label} className='shadow-sm border border-gray-100'>
                <CardBody className='flex items-center gap-4 p-4'>
                  <div className={`p-3 rounded-lg bg-${stat.color}-50 text-${stat.color}-500`}>
                    <stat.icon className='h-6 w-6'/>
                  </div>
                  <div>
                    <Typography variant='small' color='gray' className='font-normal'>
                      오늘의 {stat.label}
                    </Typography>
                    <Typography variant='h5' color='blue-gray'>
                      {stat.value}건
                    </Typography>
                  </div>
                </CardBody>
              </Card>
          ))}
        </div>

        <div className='flex justify-between items-center'>
          <Typography variant='h5' color='blue-gray'>
            경매 및 입찰 활동 추이
          </Typography>
          <ButtonGroup size='sm' variant='outlined' color='blue-gray'>
            <Button className={period === 1 ? 'bg-gray-100' : ''} onClick={() => setPeriod(1)}>일일</Button>
            <Button className={period === 7 ? 'bg-gray-100' : ''} onClick={() => setPeriod(7)}>7일</Button>
            <Button className={period === 30 ? 'bg-gray-100' : ''} onClick={() => setPeriod(30)}>30일</Button>
          </ButtonGroup>
        </div>

        <Card className='shadow-sm border border-gray-200'>
          <CardBody className='h-[400px] p-4'>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                  data={stats.dailyStats}
                  margin={{top: 10, right: 10, bottom: 10, left: 10}}
              >
                <CartesianGrid stroke="#f5f5f5" vertical={false}/>
                <XAxis dataKey="date" scale="point" padding={{left: 10, right: 10}}/>
                <YAxis/>
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}/>
                <Legend verticalAlign="top" height={36}/>
                <Bar dataKey="registeredAuctions" name="등록 경매" barSize={20} fill="#3b82f6" radius={[4, 4, 0, 0]}/>
                <Bar dataKey="registeredBids" name="등록 입찰" barSize={20} fill="#6366f1" radius={[4, 4, 0, 0]}/>
                <Line type="monotone" dataKey="wonAuctions" name="낙찰 완료" stroke="#10b981" strokeWidth={2} dot={{r: 4}}/>
                <Line type="monotone" dataKey="failedAuctions" name="경매 실패" stroke="#ef4444" strokeWidth={2} dot={{r: 4}}/>
              </ComposedChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Typography variant='h5' color='blue-gray' className='mt-8'>
          즉시 구매 및 요청 추이
        </Typography>
        <Card className='shadow-sm border border-gray-200'>
          <CardBody className='h-[350px] p-4'>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                  data={stats.dailyStats}
                  margin={{top: 10, right: 10, bottom: 10, left: 10}}
              >
                <CartesianGrid stroke="#f5f5f5" vertical={false}/>
                <XAxis dataKey="date" scale="point" padding={{left: 10, right: 10}}/>
                <YAxis/>
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}/>
                <Legend verticalAlign="top" height={36}/>
                <Bar dataKey="sentInstantBuyRequests" name="구매 요청" barSize={30} fill="#f97316" radius={[4, 4, 0, 0]}/>
                <Line type="monotone" dataKey="instantBoughtAuctions" name="즉시 구매" stroke="#f59e0b" strokeWidth={2} dot={{r: 4}}/>
                <Line type="monotone" dataKey="rejectedInstantBuyRequests" name="요청 거절" stroke="#78350f" strokeWidth={2} dot={{r: 4}}/>
              </ComposedChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>
  );
};

export default AuctionStatsView;

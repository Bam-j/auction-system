import {useState, useEffect} from 'react';

import {Card, CardBody, Typography, Button, ButtonGroup} from '@material-tailwind/react';
import {
  ShoppingBagIcon, CheckBadgeIcon, PaperAirplaneIcon,
  HandThumbUpIcon, ArrowPathIcon
} from '@heroicons/react/24/outline';
import {
  ComposedChart, Line, Bar,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';

//절대 경로 모듈
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {getFixedSaleStats} from '@/features/admin/api/dashboardApi';

const FixedSaleStatsView = () => {
  const [period, setPeriod] = useState(7);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await getFixedSaleStats(period);
        setStats(response.data);
      } catch (error) {
        console.error('일반 판매 통계 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [period]);

  if (loading) return <LoadingSpinner/>;
  if (!stats) return <div className='p-10 text-center'>통계 데이터를 불러올 수 없습니다.</div>;

  const statsSummary = [
    {label: '등록 일반 상품', value: stats.todayRegisteredFixedSales, icon: ShoppingBagIcon, color: 'blue'},
    {label: '판매 일반 상품', value: stats.todaySoldFixedSalesCount, icon: CheckBadgeIcon, color: 'green'},
    {label: '전송된 구매 요청', value: stats.todaySentPurchaseRequests, icon: PaperAirplaneIcon, color: 'deep-orange'},
    {label: '수락된 구매 요청', value: stats.todayAcceptedPurchaseRequests, icon: HandThumbUpIcon, color: 'teal'},
    {label: '취소된 구매 요청', value: stats.todayCancelledPurchaseRequests, icon: ArrowPathIcon, color: 'red'},
  ];

  return (
      <div className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4'>
          {statsSummary.map((stat) => (
              <Card key={stat.label} className='shadow-sm border border-gray-100'>
                <CardBody className='flex flex-col items-center gap-2 p-4 text-center'>
                  <div className={`p-3 rounded-full bg-${stat.color}-50 text-${stat.color}-500 mb-2`}>
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
            일반 판매 및 구매 요청 추이
          </Typography>
          <ButtonGroup size='sm' variant='outlined' color='blue-gray'>
            <Button className={period === 1 ? 'bg-gray-100' : ''} onClick={() => setPeriod(1)}>일일</Button>
            <Button className={period === 7 ? 'bg-gray-100' : ''} onClick={() => setPeriod(7)}>7일</Button>
            <Button className={period === 30 ? 'bg-gray-100' : ''} onClick={() => setPeriod(30)}>30일</Button>
          </ButtonGroup>
        </div>

        <Card className='shadow-sm border border-gray-200'>
          <CardBody className='h-[450px] p-4'>
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
                <Bar dataKey="registeredFixedSales" name="등록 상품" barSize={20} fill="#3b82f6" radius={[4, 4, 0, 0]}/>
                <Bar dataKey="soldFixedSalesCount" name="판매 수량" barSize={20} fill="#10b981" radius={[4, 4, 0, 0]}/>
                <Line type="monotone" dataKey="sentPurchaseRequests" name="구매 요청" stroke="#f97316" strokeWidth={2} dot={{r: 4}}/>
                <Line type="monotone" dataKey="acceptedPurchaseRequests" name="요청 수락" stroke="#14b8a6" strokeWidth={2} dot={{r: 4}}/>
                <Line type="monotone" dataKey="cancelledPurchaseRequests" name="요청 취소" stroke="#ef4444" strokeWidth={2} dot={{r: 4}}/>
              </ComposedChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>
  );
};

export default FixedSaleStatsView;

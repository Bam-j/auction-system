import {useState, useEffect} from 'react';

import {Card, CardBody, Typography, Button, ButtonGroup} from '@material-tailwind/react';
import {CubeIcon, ShoppingCartIcon, XCircleIcon} from '@heroicons/react/24/outline';
import {
  ComposedChart, Line, Bar,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';

//절대 경로 모듈
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {getProductStats} from '@/features/admin/api/dashboardApi';

const ProductStatsView = () => {
  const [period, setPeriod] = useState(7);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await getProductStats(period);
        setStats(response.data);
      } catch (error) {
        console.error('상품 통계 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [period]);

  if (loading) return <LoadingSpinner/>;
  if (!stats) return <div className='p-10 text-center'>통계 데이터를 불러올 수 없습니다.</div>;

  const statsSummary = [
    {label: '등록 상품', value: stats.todayRegistered, icon: CubeIcon, color: 'blue'},
    {label: '판매 상품', value: stats.todaySold, icon: ShoppingCartIcon, color: 'green'},
    {label: '등록 취소', value: stats.todayCancelled, icon: XCircleIcon, color: 'red'},
  ];

  return (
      <div className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {statsSummary.map((stat) => (
              <Card key={stat.label} className='shadow-sm border border-gray-100'>
                <CardBody className='flex items-center gap-4 p-4'>
                  <div
                      className={`p-3 rounded-lg bg-${stat.color === 'green' ? 'green' : stat.color === 'red' ? 'red' : 'blue'}-50 text-${stat.color === 'green' ? 'green' : stat.color === 'red' ? 'red' : 'blue'}-500`}>
                    <stat.icon className='h-6 w-6'/>
                  </div>
                  <div>
                    <Typography variant='small' color='gray' className='font-normal'>
                      오늘의 {stat.label}
                    </Typography>
                    <Typography variant='h4' color='blue-gray'>
                      {stat.value}건
                    </Typography>
                  </div>
                </CardBody>
              </Card>
          ))}
        </div>

        <div className='flex justify-between items-center'>
          <Typography variant='h5' color='blue-gray'>
            상품 등록 및 거래 추이
          </Typography>
          <ButtonGroup size='sm' variant='outlined' color='blue-gray'>
            <Button className={period === 1 ? 'bg-gray-100' : ''} onClick={() => setPeriod(1)}>일일</Button>
            <Button className={period === 7 ? 'bg-gray-100' : ''} onClick={() => setPeriod(7)}>7일</Button>
            <Button className={period === 30 ? 'bg-gray-100' : ''} onClick={() => setPeriod(30)}>30일</Button>
          </ButtonGroup>
        </div>

        <Card className='shadow-sm border border-gray-200'>
          <CardBody className='h-[450px] p-4'>
            <ResponsiveContainer width='100%' height='100%'>
              <ComposedChart
                  data={stats.dailyStats}
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                  }}
              >
                <CartesianGrid stroke='#f5f5f5' vertical={false}/>
                <XAxis dataKey='date' scale='point' padding={{left: 10, right: 10}}/>
                <YAxis/>
                <Tooltip
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Legend verticalAlign='top' height={36}/>
                <Bar dataKey='registered' name='등록 상품' barSize={30} fill='#3b82f6' radius={[4, 4, 0, 0]}/>
                <Line type='monotone' dataKey='sold' name='판매 상품' stroke='#10b981' strokeWidth={2}
                      dot={{r: 4}}/>
                <Line type='monotone' dataKey='cancelled' name='등록 취소' stroke='#ef4444' strokeWidth={2}
                      dot={{r: 4}}/>
              </ComposedChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>
  );
};

export default ProductStatsView;

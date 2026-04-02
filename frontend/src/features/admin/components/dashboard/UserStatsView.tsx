import {useState, useEffect} from 'react';

import {Card, CardBody, Typography, Button, ButtonGroup} from '@material-tailwind/react';
import {UserPlusIcon, NoSymbolIcon, UserMinusIcon,} from '@heroicons/react/24/outline';
import {
  ComposedChart, Line, Bar,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';

//절대 경로 모듈
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {getUserStats} from '@/features/admin/api/dashboardApi';

const UserStatsView = () => {
  const [period, setPeriod] = useState(1);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await getUserStats(period);
        setStats(response.data);
      } catch (error) {
        console.error('회원 통계 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [period]);

  if (loading) return <LoadingSpinner/>;
  if (!stats) return <div className='p-10 text-center'>통계 데이터를 불러올 수 없습니다.</div>;

  const statsSummary = [
    {label: '신규 가입', value: stats.todayNewUsers, icon: UserPlusIcon, color: 'blue'},
    {label: '차단 회원', value: stats.todayBlockedUsers, icon: NoSymbolIcon, color: 'red'},
    {label: '탈퇴 회원', value: stats.todayWithdrawnUsers, icon: UserMinusIcon, color: 'gray'},
  ];

  return (
      <div className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {statsSummary.map((stat) => (
              <Card key={stat.label} className='shadow-sm border border-gray-100'>
                <CardBody className='flex items-center gap-4 p-4'>
                  <div
                      className={`p-3 rounded-lg bg-${stat.color === 'gray' ? 'blue-gray' : stat.color}-50 text-${stat.color === 'gray' ? 'blue-gray' : stat.color}-500`}>
                    <stat.icon className='h-6 w-6'/>
                  </div>
                  <div>
                    <Typography variant='small' color='gray' className='font-normal'>
                      오늘의 {stat.label}
                    </Typography>
                    <Typography variant='h4' color='blue-gray'>
                      {stat.value}명
                    </Typography>
                  </div>
                </CardBody>
              </Card>
          ))}
        </div>

        <div className='flex justify-between items-center'>
          <Typography variant='h5' color='blue-gray'>
            회원 가입 및 상태 변경 추이
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
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                  }}
              >
                <CartesianGrid stroke="#f5f5f5" vertical={false}/>
                <XAxis dataKey="date" scale="point" padding={{left: 10, right: 10}}/>
                <YAxis/>
                <Tooltip
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Legend verticalAlign="top" height={36}/>
                <Bar dataKey="newUsers" name="신규 가입" barSize={30} fill="#3b82f6" radius={[4, 4, 0, 0]}/>
                <Line type="monotone" dataKey="blockedUsers" name="차단 회원" stroke="#ef4444" strokeWidth={2}
                      dot={{r: 4}}/>
                <Line type="monotone" dataKey="withdrawnUsers" name="탈퇴 회원" stroke="#94a3b8" strokeWidth={2}
                      dot={{r: 4}}/>
              </ComposedChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>
  );
};

export default UserStatsView;

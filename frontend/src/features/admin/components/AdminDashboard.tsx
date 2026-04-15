import {useState} from 'react';

import {Card, CardBody, Tabs, TabsHeader, Tab, Typography} from '@material-tailwind/react';
import {
  UsersIcon, CubeIcon, CurrencyDollarIcon,
  ShoppingBagIcon, PresentationChartBarIcon,
} from '@heroicons/react/24/outline';

//도메인 내부 모듈
import UserStatsView from './dashboard/UserStatsView';
import ProductStatsView from './dashboard/ProductStatsView';
import AuctionStatsView from './dashboard/AuctionStatsView';
import FixedSaleStatsView from './dashboard/FixedSaleStatsView';

type TabValue = 'users' | 'products' | 'auctions' | 'fixed-sales';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabValue>('users');

  const tabs: { label: string; value: TabValue; icon: any }[] = [
    {label: '회원', value: 'users', icon: UsersIcon},
    {label: '상품', value: 'products', icon: CubeIcon},
    {label: '경매', value: 'auctions', icon: CurrencyDollarIcon},
    {label: '일반 판매', value: 'fixed-sales', icon: ShoppingBagIcon},
  ];

  return (
      <div className='space-y-6'>
        <div className='flex items-center gap-3 mb-2'>
          <PresentationChartBarIcon className='h-8 w-8 text-primary'/>
          <Typography variant='h4' className='text-font-main'>
            활동 통계 대시보드
          </Typography>
        </div>

        <Card className='shadow-sm border border-border bg-surface transition-colors duration-300'>
          <Tabs value={activeTab}>
            <TabsHeader
                className='bg-transparent p-0 border-b border-border rounded-none'
                indicatorProps={{
                  className: 'bg-transparent border-b-2 border-primary shadow-none rounded-none',
                }}
            >
              {tabs.map(({label, value, icon: Icon}) => (
                  <Tab
                      key={value}
                      value={value}
                      onClick={() => setActiveTab(value)}
                      className={`py-4 transition-colors ${
                          activeTab === value ? 'text-primary font-bold' : 'text-font-sub'
                      }`}
                  >
                    <div className='flex items-center gap-2'>
                      <Icon className='h-5 w-5'/>
                      {label}
                    </div>
                  </Tab>
              ))}
            </TabsHeader>
            <CardBody className='p-6'>
              {activeTab === 'users' && <UserStatsView/>}
              {activeTab === 'products' && <ProductStatsView/>}
              {activeTab === 'auctions' && <AuctionStatsView/>}
              {activeTab === 'fixed-sales' && <FixedSaleStatsView/>}

              {(activeTab !== 'users' && activeTab !== 'products' && activeTab !== 'auctions' && activeTab !== 'fixed-sales') && (
                  <div
                      className='min-h-[400px] flex items-center justify-center border-2 border-dashed border-border rounded-xl bg-background/50'>
                    <div className='text-center'>
                      <Typography variant='h5' className='mb-2 text-font-main'>
                        {tabs.find((t) => t.value === activeTab)?.label} 통계 뷰
                      </Typography>
                      <Typography className='text-font-sub'>
                        QueryDSL을 통한 데이터 분석 결과가 여기에 표시될 예정입니다.
                      </Typography>
                    </div>
                  </div>
              )}
            </CardBody>
          </Tabs>
        </Card>
      </div>
  );
};

export default AdminDashboard;

import {FC} from 'react';
import {NavLink, Outlet} from 'react-router-dom';

import {Card, List, ListItem, ListItemPrefix, Typography} from '@material-tailwind/react';
import {ChevronRightIcon} from '@heroicons/react/24/outline';

import {MenuItem} from '@/types/navigation';

interface SideNavLayoutProps {
  title: string;
  menuItems: MenuItem[];
}

const SideNavLayout: FC<SideNavLayoutProps> = ({title, menuItems}) => {
  return (
      <div className='flex flex-col md:flex-row gap-6 w-full min-h-[600px]'>
        <aside className='w-full md:w-64 shrink-0'>
          <Card className='h-full w-full p-4 shadow-sm border border-border bg-surface transition-colors duration-300'>
            <div className='mb-4 p-2'>
              <Typography variant='h5' className='text-font-main'>
                {title}
              </Typography>
            </div>
            <List className='p-0'>
              {menuItems.map(({name, path, icon: Icon}) => (
                  <NavLink to={path} key={name} end>
                    {({isActive}) => (
                        <ListItem
                            className={`${
                                isActive
                                    ? 'bg-primary/10 text-primary focus:bg-primary/20 active:bg-primary/20'
                                    : 'hover:bg-primary/5 text-font-sub focus:bg-primary/5'
                            } transition-colors`}
                            selected={isActive}
                        >
                          {Icon && (
                              <ListItemPrefix>
                                <Icon className='h-5 w-5'/>
                              </ListItemPrefix>
                          )}

                          <Typography color='inherit' className='font-medium'>
                            {name}
                          </Typography>

                          {isActive && (
                              <ListItemPrefix className='ml-auto'>
                                <ChevronRightIcon className='h-4 w-4'/>
                              </ListItemPrefix>
                          )}
                        </ListItem>
                    )}
                  </NavLink>
              ))}
            </List>
          </Card>
        </aside>

        <main className='flex-1 bg-surface p-6 border border-border rounded-xl shadow-sm transition-colors duration-300'>
          <Outlet/>
        </main>
      </div>
  );
};

export default SideNavLayout;

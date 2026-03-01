import React from "react";
import {NavLink, Outlet} from "react-router-dom";
import {
  Card, List, ListItem,
  ListItemPrefix, Typography,
} from "@material-tailwind/react";
import {ChevronRightIcon} from "@heroicons/react/24/outline";

const SideNavLayout = ({title, menuItems}) => {
  return (
      <div className="flex flex-col md:flex-row gap-6 w-full min-h-[600px]">
        <aside className="w-full md:w-64 shrink-0">
          <Card className="h-full w-full p-4 shadow-sm border border-gray-200">
            <div className="mb-4 p-2">
              <Typography variant="h5" color="blue-gray">
                {title}
              </Typography>
            </div>
            <List>
              {menuItems.map(({name, path, icon: Icon}) => (
                  <NavLink to={path} key={name} end>
                    {({isActive}) => (
                        <ListItem
                            className={`${
                                isActive 
                                ? "bg-blue-50 text-blue-600 focus:bg-blue-50 active:bg-blue-50" 
                                : "hover:bg-gray-100 focus:bg-gray-100"
                            }`}
                            selected={isActive}
                        >

                          {Icon && (
                              <ListItemPrefix>
                                <Icon className="h-5 w-5"/>
                              </ListItemPrefix>
                          )}

                          <Typography color="inherit" className="font-medium">
                            {name}
                          </Typography>

                          {isActive && (
                              <ListItemPrefix className="ml-auto">
                                <ChevronRightIcon className="h-4 w-4"/>
                              </ListItemPrefix>
                          )}
                        </ListItem>
                    )}
                  </NavLink>
              ))}
            </List>
          </Card>
        </aside>

        <main className="flex-1 bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
          <Outlet/>
        </main>
      </div>
  );
};

export default SideNavLayout;
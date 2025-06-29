import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSideBar'


const AdminProfile = () => {
  return (
    <div className='h-screen lg:flex'>

      <div className=' min-w-[200px] absolute lg:fixed lg:w-[20%]'>
      <AdminSidebar />
      </div>

      <div className='flex-1 md:ml-[20%] min-ml-[200px] overflow-auto'>
      <Outlet />
      </div>

    </div>
  )
}

export default AdminProfile

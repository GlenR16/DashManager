import { createHashRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Root from './pages/Root'
import Error from './pages/Error'
import Home from './pages/Home'
import { lazy, Suspense } from 'react'
import Loading from './pages/Loading'

const CreatePage: React.LazyExoticComponent<() => React.ReactElement> = lazy(() => import('./pages/CreatePage'));
const CreateTeam: React.LazyExoticComponent<() => React.ReactElement> = lazy(() => import('./pages/CreateTeam'));
const CreateGraph: React.LazyExoticComponent<() => React.ReactElement> = lazy(() => import('./pages/CreateGraph'));
const Dashboard: React.LazyExoticComponent<() => React.ReactElement> = lazy(() => import('./pages/Dashboard'));
const EditGraph: React.LazyExoticComponent<() => React.ReactElement> = lazy(() => import('./pages/EditGraph'));
const EditPage: React.LazyExoticComponent<() => React.ReactElement> = lazy(() => import('./pages/EditPage'));
const EditTeam: React.LazyExoticComponent<() => React.ReactElement> = lazy(() => import('./pages/EditTeam'));
const Login: React.LazyExoticComponent<() => React.ReactElement> = lazy(() => import('./pages/Login'));
const Profile: React.LazyExoticComponent<() => React.ReactElement> = lazy(() => import('./pages/Profile'));
const Team: React.LazyExoticComponent<() => React.ReactElement> = lazy(() => import('./pages/Team'));
const TeamDetailRoot: React.LazyExoticComponent<() => React.ReactElement> = lazy(() => import('./pages/TeamDetailRoot'));

const router = createHashRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <Error />,
        children: [
            {
                path: "",
                element: <Home />
            },
            {
                path: "login",
                element: <Suspense fallback={<Loading />}><Login /></Suspense>
            },
            {
                path: "dashboard",
                element: <Suspense fallback={<Loading />}><Dashboard /></Suspense>
            },
            {
                path: "profile",
                element: <Suspense fallback={<Loading />}><Profile /></Suspense>
            },
            {
                path: "loading",
                element: <Loading />
            },
            {
                path: "team/create",
                element: <Suspense fallback={<Loading />}><CreateTeam /></Suspense>
            },
            {
                path: "team/:id",
                element: <Suspense fallback={<Loading />}><TeamDetailRoot /></Suspense>,
                children: [
                    {
                        path: "",
                        element: <Suspense fallback={<Loading />}><Team /></Suspense>
                    },
                    {
                        path: "edit",
                        element: <Suspense fallback={<Loading />}><EditTeam /></Suspense>
                    },
                ]
            },
            {
                path: "page/create/team/:teamId",
                element: <Suspense fallback={<Loading />}><CreatePage /></Suspense>
            },
            {
                path: "page/:id/edit",
                element: <Suspense fallback={<Loading />}><EditPage /></Suspense>
            },
            {
                path: "graph/create/page/:pageId",
                element: <Suspense fallback={<Loading />}><CreateGraph /></Suspense>
            },
            {
                path: "graph/:id/edit",
                element: <Suspense fallback={<Loading />}><EditGraph /></Suspense>
            }
        ]
    }
])

function App(): React.ReactElement {
  return <RouterProvider router={router} />
}

export default App

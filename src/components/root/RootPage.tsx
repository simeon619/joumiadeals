import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet } from '@tanstack/react-router';
import { ScrollRestoration } from '@tanstack/react-router';
import  { Suspense, useEffect, useRef, useState } from 'react'

export default function RootPage() {
  
    return (
        <div >
            <ScrollRestoration getKey={(location) => location.pathname} />
            <Suspense fallback={<div>Loading...</div>}>
                <Outlet />
            </Suspense>
            {/* <TanStackRouterDevtools position="bottom-right" /> */}
            <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
        </div>
    )
}

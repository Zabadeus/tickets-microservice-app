import { useEffect } from 'react';
import useRequest from '../../hooks/use-request';
import { useRouter } from 'next/router';

export default () => {
    const router = useRouter()
    const { doRequest, errors } = useRequest({
        url: '/api/user/signout',
        method: 'post',
        body: {},
        onSuccess: () => router.push('/')
    });

    useEffect(() => {
        doRequest();
    }, []);
    return (
            <div>
                <div>Signing you out...</div>
            </div>
        );
};

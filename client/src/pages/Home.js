import React, { useContext, useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { GET_ALL_POSTS, POST_PAGINATION } from '../graphql/queries';
import PostCard from '../components/PostCard';


const Home = () => {
    const [page, setPage] = useState(1);
    const { data, loading } = useQuery(POST_PAGINATION, {
        variables: { page }
    }, [page]);

    const handlePrev = (e) => {
        e.preventDefault();
        setPage(page-1)
    }

    const handleNext = (e) => {
        e.preventDefault();
        setPage(page+1)
    }

    const pagination = () => {
        const isPrevious = page > 1;
        const isNext = page*9 < data.postsByPage.totalCount;
        return (
            <ul className="pagination" style={{justifyContent: 'center'}}>
                { isPrevious && <li className="page-item"><a className="page-link text-primary" onClick={handlePrev} >Previous</a></li> }
                { isNext && <li className="page-item"><a className="page-link text-primary" onClick={handleNext}>Next</a></li> }
            </ul>
        );
    };

    if (loading) return <p className="p-5">Loading...</p>

    return (
        <div className="container">
            <div className="row p-5">
                { data && data.postsByPage.posts.map((post) => (
                    <div className="col-md-4 pt-5" key={post._id}>
                        <PostCard post={post}/>
                    </div>
                ))}
            </div>
            { pagination() }
        </div>
    );
}

export default Home;

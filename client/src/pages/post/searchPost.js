import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { NavContext } from '../../context/navContext';
import { POSTS_SEARCH } from '../../graphql/queries';
import PostCard from '../../components/PostCard';


const SearchPost = () => {
    const { search } = useContext(NavContext);
    const { data, loading } = useQuery(POSTS_SEARCH, { variables: {content: search.searchField}  });

    if (loading) return <h4 className="text-danger p-5">Loading...</h4>

    return (
        <div className="container p-5">
            { data && !data.postsSearch.length ? (
                <h4 className="text-danger">No search results found</h4>
            ) : (
                <h4>Search Results</h4>
            ) }

            <div className="row p-5">
                { data && data.postsSearch.map((post) => (
                    <div className="col-md-4 p-2" key={post._id}>
                        <PostCard post={post}/>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SearchPost;

import React, { createContext, useReducer } from 'react'
import { State, Children, Post, UserInfo } from '../interfaces'
import AppReducer from './AppReducer'
import { SIGN_IN, SIGN_OUT, SET_LOADING, SERVER_ERROR, ADD_POST, DELETE_POST, DELETE_LIKE, ADD_LIKE, DELETE_FOLLOWER, ADD_FOLLOWER } from './actionTypes'
import axios from 'axios'
import { SERVER_ROOT_URI } from '../utils/config'

const initialState: State = {
	isSignedIn: null,
	userId: null,
	isLoading: true,
	userInfo: null,
	feed: null,
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }: Children) => {
	const [state, dispatch] = useReducer(AppReducer, initialState);

	const setLoading = (bool: boolean) => {
		dispatch({
			type: SET_LOADING,
			payload: bool
		})
	};

	const signIn = async (userId: string) => {
		try {
			const res = await axios.get(`${SERVER_ROOT_URI}/api/v1/nottwitter/user`, {
				params: {
					googleId: userId,
					id: undefined,
					nickname: window.gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getName()
				}
			});

			dispatch({
				type: SIGN_IN,
				payload: res.data.data
			});
		} catch (error) {
			dispatch({
				type: SERVER_ERROR,
				payload: error.response.data.error
			});
		}
	};

	const signOut = () => {
		dispatch({ type: SIGN_OUT });
	};

	const getFeed = async (userId: number, isProfilePage: boolean = false) => {
		try {
			const res = await axios.get(`${SERVER_ROOT_URI}/api/v1/nottwitter/feed`, {
				params: {
					id: userId,
					isProfilePage: isProfilePage
				}
			});

			if (res.data.data) {
				dispatch({
					type: 'SET_FEED',
					payload: res.data.data as Post[]
				})
			}
		} catch (error) {
			dispatch({
				type: SERVER_ERROR,
				payload: error.response.data.error
			});
		}
		
	};

	const addPost = async (text: string, userId: number, nickname: string) => {
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		}

		try {
			const res = await axios.post(`${SERVER_ROOT_URI}/api/v1/nottwitter/posts`, {text, userId, nickname}, config);

			if (res.data.data) {
				dispatch({
					type: ADD_POST,
					payload: res.data.data as Post
				});
			}
		} catch (error) {
			dispatch({
				type: SERVER_ERROR,
				payload: error.response.data.error
			});
		}
	};

	const deletePost = async (postId: number) => {
		try {
			await axios.delete(`${SERVER_ROOT_URI}/api/v1/nottwitter/posts/${postId}`);

			dispatch({
				type: DELETE_POST,
				payload: postId
			});
		} catch (error) {
			dispatch({
				type: SERVER_ERROR,
				payload: error.response.data.error
			});
		}
	};

	const toggleLike = async (id: number, postId: number, isLiked: boolean | undefined) => {
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		}

		try {
			if (isLiked) {
				// Delete Like
				await axios.delete(`${SERVER_ROOT_URI}/api/v1/nottwitter/like/${postId}`, {
					data: {
						id: id
					}
				});

				dispatch({
					type: DELETE_LIKE,
					payload: postId
				});
			} else {
				// Add Like
				const res = await axios.post(`${SERVER_ROOT_URI}/api/v1/nottwitter/like`, { id, postId }, config);

				if (res.data.data) {
					dispatch({
						type: ADD_LIKE,
						payload: postId
					});
				}
			}
		} catch (error) {
			dispatch({
				type: SERVER_ERROR,
				payload: error
			});
		}
	};

	const getUserProfile = async (id: number) => {
		const res = await axios.get(`${SERVER_ROOT_URI}/api/v1/nottwitter/user`, {
			params: {
				id: id
			}
		});

		return res.data.data as UserInfo;
	};

	const toggleFollow = async (userId: number, profileId: number, isFollowed: boolean) => {
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		}

		try {
			if (isFollowed) {
				const res = await axios.delete(`${SERVER_ROOT_URI}/api/v1/nottwitter/follower/${profileId}`, {
					data: {
						id: userId
					}
				});

				dispatch({
					type: DELETE_FOLLOWER,
					payload: profileId
				});
			} else {
				const res = await axios.post(`${SERVER_ROOT_URI}/api/v1/nottwitter/follower`, {
					id: userId,
					followerId: profileId
				}, config);

				dispatch({
					type: ADD_FOLLOWER,
					payload: profileId
				});
			}
		} catch (error) {
			dispatch({
				type: SERVER_ERROR,
				payload: error
			});
		}
	}

	return (
		<GlobalContext.Provider
			value={{
				isSignedIn: state.isSignedIn,
				userId: state.userId,
				isLoading: state.isLoading,
				userInfo: state.userInfo,
				feed: state.feed,
				signIn: signIn,
				signOut: signOut,
				getFeed: getFeed,
				addPost: addPost,
				deletePost: deletePost,
				toggleLike: toggleLike,
				getUserProfile: getUserProfile,
				toggleFollow: toggleFollow,
				setLoading: setLoading
			}}
		>
			{children}
		</GlobalContext.Provider>
	);
};

import service from '@/utils/request'

export const useApiConfigApi = (id: number) => {
	return service.get('/data-service/api-config/' + id)
}

export const useApiConfigSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/data-service/api-config', dataForm)
	} else {
		return service.post('/data-service/api-config', dataForm)
	}
}

export const getIpPortApi = () => {
	return service.get('/data-service/api-config/getIpPort')
}

export const executeSqlApi = (sqlDto: any) => {
	return service.post('/data-service/api-config/sql/execute', sqlDto)
}

export const onlineApi = (id: number) => {
	return service.put('/data-service/api-config/'+id+'/online')
}

export const offlineApi = (id: number) => {
	return service.put('/data-service/api-config/'+id+'/offline')
}

export const requestTokenApi = (tokenUrl: any) => {
	return service.get(tokenUrl)
}

export const getAuthInfoApi = (authId: number) => {
	return service.get('/data-service/api-config/auth-info/'+authId)
}

export const ipPortApi = () => {
	return service.get('/data-service/api-config/ip-port')
}

export const resetRequestedTimesApi =(authId: number) => {
	return service.put('/data-service/api-config/reset-requested/'+ authId)
}


// 大屏数据相关API
export const getScreenDataListApi = (params: any) => {
	return service.get('/screen-data/page', { params })
}

export const createScreenDataApi = (data: any) => {
	return service.post('/screen-data', data)
}

export const updateScreenDataApi = (data: any) => {
	return service.put('/screen-data', data)
}

export const deleteScreenDataApi = (ids: number[]) => {
	return service.delete('/screen-data', { data: ids })
}

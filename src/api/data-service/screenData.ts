import service from '@/utils/request'

export const useScreenDataApi = (id: number) => {
    return service.get('/data-service/screen-data/' + id)
}

export const getScreenDataListApi = (params: any) => {
    return service.get('/data-service/screen-data/page', { params })
}

export const createScreenDataApi = (data: any) => {
    return service.post('/data-service/screen-data', data)
}

export const updateScreenDataApi = (data: any) => {
    return service.put('/data-service/screen-data', data)
}

export const deleteScreenDataApi = (ids: number[]) => {
    return service.delete('/data-service/screen-data', { data: ids })
}

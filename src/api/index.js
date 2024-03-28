import axios from "axios"
import { API_URL } from "../config1"

const getListProvince = async () => {
  try {
    const res = await axios({
      url: "https://vapi.vnappmob.com/api/province",
      method: "get"
    })
    const result = await res.data.results
    return result

  } catch (error) {
    console.log(error)
  }
}

// get list district

export const apiGetProvince = async (provinceCode) => {
  try {
    const res= await axios({
      url: `https://vapi.vnappmob.com/api/province/district/${provinceCode}`,
      method: "get",
    })
    const result= await res.data
    return result
  } catch (error) {
    console.log(error)
  }
}

export const apiGetWard= async (districtCode)=> {
  try {
    const res= await axios({
      url: `https://vapi.vnappmob.com/api/province/ward/${districtCode}`
    })
    const result= await res.data
    return result
  } catch (error) {
    console.log(error)
  }
} 

export const apiCreateTour= async (data)=> {
  try {
    const res= await axios({
      url: API_URL+ "/api/v1/tour",
      method: "post",
      data: {
        ...data
      }
    })
    const result= await res.data
    return result
  } catch (error) {
    console.log(error)
  }
}

export const apiEditTour= async (data)=> {
  try {
    const res= await axios({
      url: API_URL + "/api/v1/tour",
      method: "put",
      data: {
        ...data
      }
    })
    const result= await res.data
    return result
  } catch (error) {
    console.log(error)
    
  }
}

export const apiCreateBlog= async (data)=> {
  try {
    const res= await axios({
      url: API_URL+ "/api/v1/blog",
      method: "post",
      data: {
        ...data
      }
    })
    const result= await res.data
    return result
  } catch (error) {
    console.log(error)
  }
}

export const apiEditBlog= async (data)=> {
  try {
    const res= await axios({
      url: API_URL+ "/api/v1/blog",
      method: "put",
      data: {
        ...data
      }
    })
    const result= await res.data
    return result
  } catch (error) {
    console.log(error)
  }
}

export const apiGetListTour= async (data)=> {
  try {
    const res= await axios({
      url: API_URL + "/api/v1/tour",
      method: "get"
    })
    const result= await res.data
    return result

  } catch (error) {
    console.log(error)
  }
}

export const apiGetListBlog= async (data)=> {
  try {
    const res= await axios({
      url: API_URL + "/api/v1/blog",
      method: "get"
    })
    const result= await res.data
    return result

  } catch (error) {
    console.log(error)
  }
}

export const apiDeleteTour= async (data)=> {
  try {
    const res= await axios({
      url: API_URL + "/api/v1/tour",
      method: "delete",
      data: {
        ...data
      }
    })
    const result= await res.data
    return result

  } catch (error) {
    console.log(error)
  }
}

export const apiDeleteBlog= async (data)=> {
  try {
    const res= await axios({
      url: API_URL + "/api/v1/blog",
      method: "delete",
      data: {
        ...data
      }
    })
    const result= await res.data
    return result

  } catch (error) {
    console.log(error)
  }
}

export const apiGetChildCategory= async (data)=> {
  try {
    const res= await axios({
      url: API_URL + "/api/v1/category/c",
      method: "get",
      params: {
        ...data
      }
    })
    const result= await res.data
    return result

  } catch (error) {
    console.log(error)
  }
}

export { getListProvince }
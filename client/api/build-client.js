import axios from "axios"

export default ({ req }) => {
  if(typeof window === 'undefined') {
    // we are on the server!
    // requests should be made to ingress domain
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local', 
      headers: req.headers
    });
  } else {
    // we are on the browser!
    // requests should be made as usual from browser
    return axios.create({
      baseURL: '/'
    });
  }
}
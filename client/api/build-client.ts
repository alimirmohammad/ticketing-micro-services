import axios, { AxiosRequestHeaders } from "axios";
import { GetServerSidePropsContext, NextPageContext } from "next";

export default function buildClient({
  req,
}: NextPageContext | GetServerSidePropsContext) {
  if (typeof window !== "undefined") {
    return axios.create();
  }
  return axios.create({
    baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
    headers: req?.headers as AxiosRequestHeaders,
  });
}

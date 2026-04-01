package com.openmaps.saas.net

import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor

object HttpClient {
    val okHttp: OkHttpClient by lazy {
        val logger = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BASIC
        }
        OkHttpClient.Builder()
            .addInterceptor { chain ->
                val req = chain.request().newBuilder()
                    .header("User-Agent", "OpenMapsSaaS/0.1 (Android)")
                    .build()
                chain.proceed(req)
            }
            .addInterceptor(logger)
            .build()
    }
}


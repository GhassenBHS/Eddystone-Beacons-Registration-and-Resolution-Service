package com.pfe.ghassen.beaconeddystoneeid.Network.Interfaces;


import com.pfe.ghassen.beaconeddystoneeid.Network.Models.BeaconModel;

import retrofit2.Call;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface ResolutionService {

    @POST("resolve")
    Call<Void> resolveBeacon(@Body BeaconModel body);

    static final Retrofit retrofit = new Retrofit.Builder()
            .baseUrl("https://beacon-resolution-service.herokuapp.com/")
            .addConverterFactory(GsonConverterFactory.create())
            .build();
}

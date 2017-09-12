package com.pfe.ghassen.beaconeddystoneeid.Network.Models;


import com.google.gson.annotations.SerializedName;

public class BeaconModel {

    @SerializedName("eid")
    private String eid;


    public BeaconModel (String eid)
    {
        this.eid=eid ;

    }

    public String getEid() {
        return eid;
    }

    public void setEid(String eid) {
        this.eid = eid;
    }
}

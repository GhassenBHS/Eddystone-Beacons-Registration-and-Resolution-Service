package com.pfe.ghassen.beaconeddystoneeid.RcyclerView;


import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;


import com.pfe.ghassen.beaconeddystoneeid.R;

import org.altbeacon.beacon.Identifier;

import java.util.ArrayList;



public class eidListAdapter extends RecyclerView.Adapter<eidListAdapter.MyViewHolder> {

    public ArrayList<Identifier> listeid;
    public ArrayList<String> listmac;
    public ArrayList<Integer> listRSSI;
    private Context mContext;
    private int size =0 ;


    public eidListAdapter(Context context, int size, ArrayList<Identifier> listeid, ArrayList<String> listmac,
                          ArrayList<Integer> listRSSI) {
        mContext = context;
        this.size=size ;
        this.listeid = listeid;
        this.listmac = listmac;
        this.listRSSI = listRSSI;
    }


    public class MyViewHolder extends RecyclerView.ViewHolder {
        public TextView mac_address, eid, rssi;




        public MyViewHolder(View view) {
            super(view);
            mac_address = (TextView) view.findViewById(R.id.mac_address);
            eid = (TextView) view.findViewById(R.id.eid);
            rssi = (TextView) view.findViewById(R.id.rssi);


        }
    }




    @Override
    public  MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item, parent, false);


        return new MyViewHolder(itemView);
    }



    @Override
    public void onBindViewHolder(final MyViewHolder holder, final int position) {

        holder.mac_address.setText("MAC Address:" + listmac.get(position));
        holder.eid.setText("EID:" +listeid.get(position));
        holder.rssi.setText("RSSI:" +listRSSI.get(position));


    }




    @Override
    public int getItemCount() {
        return listeid.size();
    }




}

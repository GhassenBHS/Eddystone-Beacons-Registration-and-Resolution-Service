package com.pfe.ghassen.beaconeddystoneeid.Activities;

import android.content.DialogInterface;
import android.os.Bundle;
import android.os.Handler;
import android.os.RemoteException;
import android.support.annotation.NonNull;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.DefaultItemAnimator;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;
import android.telecom.Call;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;

import com.afollestad.materialdialogs.DialogAction;
import com.afollestad.materialdialogs.MaterialDialog;
import com.pfe.ghassen.beaconeddystoneeid.Network.Interfaces.ResolutionService;
import com.pfe.ghassen.beaconeddystoneeid.Network.Models.BeaconModel;
import com.pfe.ghassen.beaconeddystoneeid.R;
import com.pfe.ghassen.beaconeddystoneeid.RcyclerView.DividerItemDecoration;
import com.pfe.ghassen.beaconeddystoneeid.RcyclerView.RecyclerItemClickListener;
import com.pfe.ghassen.beaconeddystoneeid.RcyclerView.eidListAdapter;

import org.altbeacon.beacon.Beacon;
import org.altbeacon.beacon.BeaconConsumer;
import org.altbeacon.beacon.BeaconManager;
import org.altbeacon.beacon.BeaconParser;
import org.altbeacon.beacon.Identifier;
import org.altbeacon.beacon.MonitorNotifier;
import org.altbeacon.beacon.RangeNotifier;
import org.altbeacon.beacon.Region;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Timer;
import java.util.TimerTask;

import belka.us.androidtoggleswitch.widgets.ToggleSwitch;
import retrofit2.Callback;
import retrofit2.Response;

public class ScanActivity extends AppCompatActivity implements BeaconConsumer,RangeNotifier {

    private BeaconManager mBeaconManager;
    protected RecyclerView recyclerView;

    private boolean ischecked=false ;


    final ArrayList<String> listmac = new ArrayList<>();
    final ArrayList<Integer> listRSSI = new ArrayList<>();
    final ArrayList<Identifier> listeid = new ArrayList<>();





    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_scan);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        ToggleSwitch toggleSwitch = (ToggleSwitch) findViewById(R.id.keyswitch);
        ArrayList<String> labels = new ArrayList<>();
        labels.add("OFF");
        labels.add("ON");
        toggleSwitch.setLabels(labels);
        recyclerView = (RecyclerView) findViewById(R.id.recyclerview);

        toggleSwitch.setOnToggleSwitchChangeListener(new ToggleSwitch.OnToggleSwitchChangeListener(){

            @Override
            public void onToggleSwitchChangeListener(int position, boolean isChecked) {


                Log.e("listenerbhs", String.valueOf(position)) ;
                ischecked=false ;
                if (position==1)
                {
                    ischecked = true ;
                    final Handler handler = new Handler() ;
                    handler.postDelayed( new Runnable() {

                        @Override
                        public void run() {


                            final eidListAdapter adapter = new eidListAdapter(getApplicationContext(), listmac.size(),
                                    listeid,listmac,listRSSI);
                            RecyclerView.LayoutManager mLayoutManager = new LinearLayoutManager(getApplicationContext());
                            recyclerView.setLayoutManager(mLayoutManager);
                            recyclerView.setItemAnimator(new DefaultItemAnimator());
                            recyclerView.addItemDecoration(new DividerItemDecoration(getApplicationContext(), LinearLayoutManager.VERTICAL));

                            recyclerView.setAdapter(adapter);
                            Log.e("mlk",listeid.toString());
                            adapter.notifyDataSetChanged();
                            handler.postDelayed( this, 6000 );
                        }
                    }, 6000 );

                }



            }
        });

        recyclerView.addOnItemTouchListener(
                new RecyclerItemClickListener(getApplicationContext(), recyclerView ,new RecyclerItemClickListener.OnItemClickListener() {
                    @Override public void onItemClick(View view, int position) {

                        final String eid2resolve=listeid.get(position).toString().substring(2,listeid.get(position).toString().length()) ;
                        Log.e("eid2resolve",eid2resolve);

                        new MaterialDialog.Builder(ScanActivity.this)
                                .title(R.string.title_dialog_resolve)
                                .content(R.string.content_dialog_resolve)
                                .positiveText("Resolve")
                                .negativeText("Cancel")
                                .onPositive(new MaterialDialog.SingleButtonCallback(){

                                    @Override
                                    public void onClick(@NonNull MaterialDialog dialog, @NonNull DialogAction which) {

                                        BeaconModel beaconModel = new BeaconModel(eid2resolve) ;
                                        ResolutionService resolutionService = ResolutionService.retrofit.create(ResolutionService.class) ;
                                        retrofit2.Call<Void> call = resolutionService.resolveBeacon(beaconModel) ;
                                        call.enqueue(new Callback<Void>() {
                                            @Override
                                            public void onResponse(retrofit2.Call<Void> call, Response<Void> response) {
                                                if (!response.isSuccessful()) {


                                                }
                                            }

                                            @Override
                                            public void onFailure(retrofit2.Call<Void> call, Throwable t) {

                                            }
                                        });                                    }
                                })
                                .onNegative(new MaterialDialog.SingleButtonCallback() {
                                    @Override
                                    public void onClick(@NonNull MaterialDialog dialog, @NonNull DialogAction which) {
                                        // TODO
                                    }
                        })
                                .show();

                    }

                    @Override public void onLongItemClick(View view, int position) {
                        // do whatever
                    }
                })
        );








    }

    @Override
    protected void onPause() {
        super.onPause();
        mBeaconManager.unbind(this);
    }

    @Override
    protected void onResume() {
        super.onResume();
        mBeaconManager = BeaconManager.getInstanceForApplication(this);
        // Detect Eddystone-EID
        mBeaconManager.getBeaconParsers().add(new BeaconParser().
                setBeaconLayout("s:0-1=feaa,m:2-2=30,p:3-3:-41,i:4-11")); // "s:0-1=feaa,m:2-2=30,p:3-3:-41,i:4-11"

        mBeaconManager.bind(this);
    }

    @Override
    public void onBeaconServiceConnect() {

            Region region = new Region("all-beacons-region", null, null, null);
            try {
                mBeaconManager.startRangingBeaconsInRegion(region);
            } catch (RemoteException e) {
                e.printStackTrace();
            }
            mBeaconManager.addRangeNotifier(this);





    }



    @Override
    public void didRangeBeaconsInRegion(Collection<Beacon> collection, Region region) {



        if (ischecked)
        {
            for (Beacon beacon: collection) {
                if (beacon.getServiceUuid() == 0xfeaa && beacon.getBeaconTypeCode() == 0x30) {
                    // This is a Eddystone-EID frame



                    Identifier ephemeralId = beacon.getId1();
                    String bluetooth = beacon.getBluetoothAddress() ;
                    int rssi= beacon.getRssi() ;

                    if (listmac.size()==0)
                    {
                        listmac.add(bluetooth);
                        listRSSI.add(rssi);
                        listeid.add(ephemeralId);
                        Log.e("added",bluetooth) ;
                    }
                    else if (listmac.size()==1 && !listmac.get(0).equals(bluetooth))
                    {
                        listmac.add(bluetooth);
                        listRSSI.add(rssi);
                        listeid.add(ephemeralId);
                        Log.e("added",bluetooth) ;

                    }
                    else if (listmac.size()>1 && !listmac.get(listmac.size()-1).equals(listmac.get(listmac.size()-2)))
                    {
                        listmac.add(bluetooth);
                        listRSSI.add(rssi);
                        listeid.add(ephemeralId);
                        Log.e("added",bluetooth) ;

                    }




                    Log.e("poiu",listmac.toString());
                    Log.e("bluebhs",listmac.get(listmac.size()-1));
                    Log.e("blubhs",bluetooth);



                    Log.e("ghassen", "I see a beacon transmitting ephemeral id: "+ephemeralId+
                            " approximately "+beacon.getDistance()+" meters away.");

                }
            }

        }







    }



}

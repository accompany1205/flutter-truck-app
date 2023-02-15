import 'package:flutter/material.dart';
import 'package:packet_truck_app/styles/colors.dart';
import 'package:packet_truck_app/styles/textStyles.dart';
import 'package:packet_truck_app/views/login/loginView.dart';

class Profile extends StatelessWidget {

  final String image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDOBOc038FVsxw3ysd7QljguZM-n5Ma2nOuklOmNPZibtVOf6KjQ&s';
  final String testString = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';


  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        children: <Widget>[
          Container(
            decoration: BoxDecoration(
                color: primaryColor,
                borderRadius: const BorderRadius.only(
                  bottomLeft: const Radius.circular(30),
                  bottomRight: const Radius.circular(30),
                )
            ),
            child: FractionallySizedBox(
              widthFactor: 1,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: <Widget>[
                  SizedBox(
                    height: 35,
                  ),
                  ClipRRect(
                    borderRadius: BorderRadius.all(Radius.circular(50)),
                    child: Image.network(
                      image,
                      width: 100,
                      height: 100,
                      fit: BoxFit.fitHeight,
                    ),
                  ),
                  SizedBox(
                    height: 15,
                  ),
                  Text('Name', style: titleBoldWhiteTextStyle,),
                  SizedBox(
                    height: 15,
                  ),
                  SizedBox(
                    height: 35,
                  ),
                ],
              ),
            ),
          ),
          Column(
            children: <Widget>[
              ListTile(
                title: Text('Personal information'),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 15),
                child: Text(testString),
              ),
              Padding(
                padding: const EdgeInsets.only(right: 15),
                child: Align(
                  alignment: Alignment.centerRight,
                  child: IconButton(
                    icon: Icon(Icons.add_circle_outline, color: Colors.blue,),
                    onPressed: (){

                    },
                  ),
                ),
              ),
              Divider(
                color: Colors.grey,
              ),
              ListTile(
                title: Text('Certificate'),
              ),
              ListTile(
                leading: Icon(Icons.check_circle_outline, color: Colors.green,),
                title: Text('+34 652555468'),
              ),
              ListTile(
                leading: Icon(Icons.check_circle_outline, color: Colors.green,),
                title: Text('email@gmail.es'),
              ),
              Divider(
                color: Colors.grey,
              ),
              ListTile(
                title: Text('Vehicules'),
                trailing: FlatButton(
                  child: Text('Add', style: buttonBlueTextStyle,),
                  onPressed: (){

                  },
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 15),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: <Widget>[
                    ClipRRect(
                      borderRadius: BorderRadius.all(Radius.circular(20)),
                      child: Image.network(
                        'https://www.lavanguardia.com/r/GODO/LV/p6/WebSite/2019/10/08/Recortada/img_smoreno_20191008-190716_imagenes_lv_terceros_ford-trucks-espana-jarama_10-kRMD-U47875006471mFD-992x558@LaVanguardia-Web.jpg',
                        width: 100,
                        height: 100,
                        fit: BoxFit.fitHeight,
                      ),
                    ),
                    IconButton(
                      onPressed: (){

                      },
                      icon: Icon(Icons.edit, color: Colors.blue,),
                    ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 10),
                child: ListTile(
                  title: Text('Truck 1'),
                  subtitle: Text('5.000 kg'),
                ),
              ),
              Divider(
                color: Colors.grey,
              ),
              ListTile(
                title: Text('Comment'),
              ),
              ListTile(
                title: Text('Received comments', style: buttonBlueTextStyle,),
                onTap: () {

                },
              ),
              ListTile(
                title: Text('Sended comments', style: buttonBlueTextStyle,),
                onTap: () {

                },
              ),
              Divider(
                color: Colors.grey,
              ),
              ListTile(
                title: Text('Settings'),
              ),
              ListTile(
                title: Text('Change personal information', style: buttonBlueTextStyle,),
                onTap: () {

                },
              ),
              Divider(
                color: Colors.grey,
              ),
              ListTile(
                title: Text('Money'),
              ),
              ListTile(
                title: Text('Transfers', style: buttonBlueTextStyle,),
                onTap: () {

                },
              ),
              ListTile(
                title: Text('History of reservations', style: buttonBlueTextStyle,),
                onTap: () {

                },
              ),

              FlatButton(
                child: Text('LOG OUT', style: buttonBlueTextStyle,),
                onPressed: () {
                  Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(
                          builder: (context) => LoginView()
                      ));
                },
              ),
            ],
          ),
        ],
      ),
    );
  }
}

import 'package:flare_flutter/flare_actor.dart';
import 'package:flutter/material.dart';
import 'package:packet_truck_app/styles/colors.dart';
import 'package:packet_truck_app/styles/textStyles.dart';

class SearchDetailsView extends StatelessWidget {

  @override
  Widget build(BuildContext context) {

    Size size = MediaQuery.of(context).size;

    return Scaffold(
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            BackButton(color: primaryColor,),
            SizedBox(
              height: 35,
            ),
            Container(
                height: size.height*0.3,
                child: FlareActor("assets/animation/empty_search.flr", animation:"empty", fit: BoxFit.fitHeight,)
            ),
            SizedBox(
              height: 20,
            ),
            Center(child: Text('There is no trips for this day', style: titleBoldTextStyle,)),
          ],
        ),
      ),
    );
  }
}

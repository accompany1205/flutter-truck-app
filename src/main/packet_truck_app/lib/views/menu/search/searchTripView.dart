import 'package:flutter/material.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';
import 'package:packet_truck_app/styles/textStyles.dart';
import 'package:packet_truck_app/views/menu/search/searchDetailsView.dart';


class SearchTripView extends StatelessWidget {

  final FocusNode _fromFocus = FocusNode();
  final FocusNode _toFocus = FocusNode();

  final TextEditingController _fromController = TextEditingController();
  final TextEditingController _toController = TextEditingController();

  DateTime _dateTime;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: FractionallySizedBox(
        widthFactor: 1,
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: <Widget>[
              SizedBox(
                height: 20,
              ),
              Text("Let's Get Started!", style: titleBoldTextStyle,),
              SizedBox(
                height: 20,
              ),
              FractionallySizedBox(
                widthFactor: 0.75,
                child: TextFormField(
                  decoration: InputDecoration(
                      border: OutlineInputBorder(
                        borderRadius: const BorderRadius.all(const Radius.circular(30)),
                      ),
                      labelText: 'From',
                      prefixIcon: Icon(MdiIcons.locationEnter)
                  ),
                  focusNode: _fromFocus,
                  controller: _fromController,
                  textInputAction: TextInputAction.next,
                  validator: (val) => val.length < 3 ? '' : null,
                  onFieldSubmitted: (String value) {
                    _fromFocus.unfocus();
                    FocusScope.of(context).requestFocus(_toFocus);
                  },
                ),
              ),
              SizedBox(
                height: 15,
              ),
              FractionallySizedBox(
                widthFactor: 0.75,
                child: TextFormField(
                  decoration: InputDecoration(
                      border: OutlineInputBorder(
                        borderRadius: const BorderRadius.all(const Radius.circular(30)),
                      ),
                      labelText: 'To',
                      prefixIcon: Icon(MdiIcons.locationExit)
                  ),
                  focusNode: _toFocus,
                  controller: _toController,
                  validator: (val) => val.length < 3 ? '' : null,
                ),
              ),
              SizedBox(
                height: 25,
              ),
              Divider(
                color: Colors.grey,
                endIndent: 15,
                indent: 15,
              ),
              ListTile(
                title: Text('Date'),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8),
                child: Row(
                  children: <Widget>[
                    IconButton(
                      icon: Icon(MdiIcons.calendarMonth, color: Colors.blue,),
                      onPressed: () {
                        final now = DateTime.now();
                        showDatePicker(
                            context: context,
                            initialDate: DateTime(now.year, now.month, now.day+1),
                            firstDate: DateTime.now(),
                            lastDate: DateTime(2040))
                            .then((date){
                              _dateTime = date;
                        });
                      },
                    ),
                    if(this._dateTime!=null)
                      Text(this._dateTime.toString(), style: buttonBlueTextStyle,),
                  ],
                ),
              ),
              Divider(
                color: Colors.grey,
                endIndent: 15,
                indent: 15,
              ),
              SizedBox(
                height: 15,
              ),
              RaisedButton(
                child: Text('Search!', style: TextStyle(color: Colors.white),),
                color: Colors.blue,
                onPressed: (){
                  Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) =>  SearchDetailsView()
                      ));
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}

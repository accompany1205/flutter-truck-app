import Match from '../domain/match.entity';
import TransporterAccount from '../domain/transporter-account.entity';
import Truck from '../domain/truck.entity';
import { User } from '../domain/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import Trip from '../domain/trip.entity';
import { ITripsAverage } from 'src/shared/interface/ITripsAverage';
import ClientAccount from '../domain/client-account.entity';
import Location from '../domain/location.entity';

@EntityRepository(Trip)
export class TripRepository extends Repository<Trip> {
    async selectAllForTransporter(userId: string, pageIndex: number, pageSize: number): Promise<[ITripsAverage[], number]> {
        const rawQuery = await this.manager.query('SELECT `trip`.`id` AS `trip_id`, `trip`.`is_full` AS `trip_is_full`, `trip`.`width` AS `trip_width`, `trip`.`height` AS `trip_height`, `trip`.`length` AS `trip_length`, `trip`.`weight` AS `trip_weight`, `trip`.`marchandise` AS `trip_marchandise`, `trip`.`etd` AS `trip_etd`, `trip`.`description` AS `trip_description`, `trip`.`state` AS `trip_state`, `trip`.`eta` AS `trip_eta`, `trip`.`distance` AS `trip_distance`, `trip`.`tripImg` AS `trip_tripImg`, `trip`.`originId` AS `trip_originId`, `trip`.`destinationId` AS `trip_destinationId`, `trip`.`clientAccountId` AS `trip_clientAccountId`, `user`.`id` AS `user_id`, `user`.`imageUrl` AS `user_imageUrl`, `user`.`firstName` AS `user_firstName`, `user`.`lastName` AS `user_lastName`, `user`.`verified_email` AS user_verified_email, `user`.`mini_Bio` AS `user_miniBio`, `user`.`phone` AS `user_phone`, `matches`.`id` AS `matches_id`, `matches`.`status` AS `matches_status`, `matches`.`date` AS `matches_date`, `matches`.`conversationId` AS `matches_conversationId`, `matches`.`truckId` AS `matches_truckId`, `matches`.`tripId` AS `matches_tripId`, `origin`.`street_address` AS `origin_streetAddress`, `origin`.`postal_code` AS `origin_postalCode`, `origin`.`city` AS `origin_city`, `origin`.`state_province` AS `origin_stateProvince`, `origin`.`country` AS `origin_country`, `origin`.`latitude` AS `origin_latitude`, `origin`.`longitude` AS `origin_longitude`, `destination`.`street_address` AS `destination_streetAddress`, `destination`.`postal_code` AS `destination_postalCode`, `destination`.`city` AS `destination_city`, `destination`.`state_province` AS `destination_stateProvince`, `destination`.`country` AS `destination_country`, `destination`.`latitude` AS `destination_latitude`, `destination`.`longitude` AS `destination_longitude`, `truck`.`id` AS `truck_id`, `truck`.`model` AS `truck_model`, `truck`.`plate_number` AS `truck_plate_number`, `truck`.`conteneur_plate_number` AS `truck_conteneur_plate_number`, `truck`.`year` AS `truck_year`, `truck`.`type` AS `truck_type`, `truck`.`image_url` AS `truck_image_url`, `truck`.`width` AS `truck_width`, `truck`.`height` AS `truck_height`, `truck`.`length` AS `truck_length`, `truck`.`max_weight` AS `truck_max_weight`, `truck`.`transporterAccountId` AS `truck_transporterAccountId`, `transporterAccount`.`id` AS `transporterAccount_id`, `transporterAccount`.`name` AS `transporterAccount_name`, `transporterAccount`.`patent` AS `transporterAccount_patent`, `transporterAccount`.`patent_content_type` AS `transporterAccount_patent_content_type`, `transporterAccount`.`balance` AS `transporterAccount_balance`, `transporterAccount`.`end_of_subscription` AS `transporterAccount_end_of_subscription`, `transporterAccount`.`insurance` AS `transporterAccount_insurance`, `transporterAccount`.`insurance_content_type` AS `transporterAccount_insurance_content_type`, `transporterAccount`.`userId` AS `transporterAccount_userId`, ( SELECT avg(reputation.rate) FROM reputation WHERE reputation.toId = `user`.id ) AS `reputation_rate` FROM `trip` `trip` INNER JOIN `match` `matches` ON `matches`.`tripId`=`trip`.`id` INNER JOIN `location` `origin` ON `origin`.`id` = `trip`.`originId` INNER JOIN `location` `destination` ON `destination`.`id` = `trip`.`destinationId` INNER JOIN `client_account` `clientAccount` ON `clientAccount`.`id`=`trip`.`clientAccountId` INNER JOIN `jhi_user` `user` ON `user`.`id`=`clientAccount`.`userId` INNER JOIN `truck` `truck` ON `truck`.`id`=`matches`.`truckId` INNER JOIN `transporter_account` `transporterAccount` ON `transporterAccount`.`id`=`truck`.`transporterAccountId` WHERE ( `transporterAccount`.`id` = ? ) LIMIT ?, ?', [userId, pageIndex, pageSize]);
        const trips: ITripsAverage[] = [];
        let bufferTrip: Trip
        let bufferReputation: number;
        let bufferMatch: Match
        let bufferTruck: Truck;
        let bufferUser: User;
        let bufferClientAccount: ClientAccount;
        let bufferTransporter: TransporterAccount;
        let bufferOrigin: Location;
        let bufferDestination: Location;
        rawQuery.forEach(element => {
            bufferTrip= new Trip();
            bufferReputation;
            bufferMatch = new Match();
            bufferTruck = new Truck();
            bufferUser = new User();
            bufferClientAccount = new ClientAccount();
            bufferTransporter = new TransporterAccount();
            bufferDestination = new Location();
            bufferOrigin = new Location();
            Object.keys(element).forEach(key => {
                bufferTrip.id = element['trip_id'];
                bufferTrip.isFull = element['trip_is_full'];
                bufferTrip.width = element['trip_width'];
                bufferTrip.height = element['trip_height'];
                bufferTrip.length = element['trip_length'];
                bufferTrip.weight = element['trip_weight'];
                bufferTrip.marchandise = element['trip_marchandise'];
                bufferTrip.etd = element['trip_etd'];
                bufferTrip.description = element['trip_description'];
                bufferTrip.state = element['trip_state'];
                bufferTrip.eta = element['trip_eta'];
                bufferTrip.tripImg = element['trip_tripImg'];
                bufferTrip.distance = element['trip_distance'];
                bufferMatch.id = element['matches_id'];
                bufferMatch.status = element['matches_status'];
                bufferMatch.date = element['matches_date'];
                bufferMatch.conversation = element['matches_conversationId'];
                bufferMatch.truck = element['matches_truckId'];
                bufferMatch.trip = element['matches_tripId'];
                bufferTruck.id = element['truck_id'];
                bufferTruck.model = element['truck_model'];
                bufferTruck.plateNumber = element['truck_plate_number'];
                bufferTruck.conteneurPlateNumber = element['truck_conteneur_plate_number'];
                bufferTruck.year = element['truck_year'];
                bufferTruck.type = element['truck_type'];
                bufferTruck.imgUrl = element['truck_image_url'];
                bufferTruck.width = element['truck_width'];
                bufferTruck.height = element['truck_height'];
                bufferTruck.length = element['truck_length'];
                bufferTruck.maxWeight = element['truck_max_weight'];
                bufferTruck.transporterAccount = element['truck_transporterAccountId'];
                bufferTransporter.id = element['transporterAccount_id'];
                bufferTransporter.name = element['transporterAccount_name'];
                bufferTransporter.patent = element['transporterAccount_patent'];
                bufferTransporter.patentContentType = element['transporterAccount_patent_content_type'];
                bufferTransporter.insurance = element['transporterAccount_insurance'];
                bufferTransporter.user = element['transporterAccount_userId'];
                bufferOrigin.id = element['trip_originId'];
                bufferOrigin.latitude = element['origin_latitude'];
                bufferOrigin.longitude = element['origin_longitude'];
                bufferOrigin.city = element['origin_city'];
                bufferOrigin.postalCode = element['origin_postalCode'];
                bufferOrigin.stateProvince = element['origin_stateProvince'];
                bufferOrigin.streetAddress = element['origin_streetAddress'];
                bufferOrigin.country = element['origin_country'];
                bufferDestination.id = element['trip_originId'];
                bufferDestination.latitude = element['destination_latitude'];
                bufferDestination.longitude = element['destination_longitude'];
                bufferDestination.city = element['destination_city'];
                bufferDestination.postalCode = element['destination_postalCode'];
                bufferDestination.stateProvince = element['destination_stateProvince'];
                bufferDestination.streetAddress = element['destination_streetAddress'];
                bufferDestination.country = element['destination_country'];
                bufferTransporter.trucks = [];
                bufferUser.id = element['user_id'];
                bufferUser.firstName = element['user_firstName'];
                bufferUser.lastName = element['user_lastName'];
                bufferUser.imageUrl = element['user_imageUrl'];
                bufferUser.phone =  element['user_phone'];
                bufferUser.miniBio = element['user_miniBio'];
                bufferUser.verifiedEmail = Boolean(element['user_verified_email']);
                bufferReputation = Number(element['reputation_rate']);
                bufferClientAccount.id = element['trip_clientAccountId'];
                bufferClientAccount.user = bufferUser;
                bufferMatch.truck = bufferTruck;
                bufferTrip.matches = [bufferMatch];
                bufferTrip.clientAccount = bufferClientAccount;
                bufferTrip.destination = bufferDestination;
                bufferTrip.origin = bufferOrigin;
            });

            trips.push({
                trip: bufferTrip,
                averageReputation: bufferReputation
            });

        });

        return [trips, trips.length];
    }


    async selectAllForForAdmin(pageIndex: number, pageSize: number): Promise<[ITripsAverage[], number]> {
      const rawQuery = await this.manager.query('SELECT `trip`.`id` AS `trip_id`, `trip`.`is_full` AS `trip_is_full`, `trip`.`width` AS `trip_width`, `trip`.`height` AS `trip_height`, `trip`.`length` AS `trip_length`, `trip`.`weight` AS `trip_weight`, `trip`.`marchandise` AS `trip_marchandise`, `trip`.`etd` AS `trip_etd`, `trip`.`description` AS `trip_description`, `trip`.`state` AS `trip_state`, `trip`.`eta` AS `trip_eta`, `trip`.`distance` AS `trip_distance`, `trip`.`tripImg` AS `trip_tripImg`, `trip`.`originId` AS `trip_originId`, `trip`.`destinationId` AS `trip_destinationId`, `trip`.`clientAccountId` AS `trip_clientAccountId`, `user`.`id` AS `user_id`, `user`.`imageUrl` AS `user_imageUrl`, `user`.`firstName` AS `user_firstName`, `user`.`lastName` AS `user_lastName`, `user`.`verified_email` AS user_verified_email, `user`.`mini_Bio` AS `user_miniBio`, `user`.`phone` AS `user_phone`, `matches`.`id` AS `matches_id`, `matches`.`status` AS `matches_status`, `matches`.`date` AS `matches_date`, `matches`.`conversationId` AS `matches_conversationId`, `matches`.`truckId` AS `matches_truckId`, `matches`.`tripId` AS `matches_tripId`, `origin`.`street_address` AS `origin_streetAddress`, `origin`.`postal_code` AS `origin_postalCode`, `origin`.`city` AS `origin_city`, `origin`.`state_province` AS `origin_stateProvince`, `origin`.`country` AS `origin_country`, `origin`.`latitude` AS `origin_latitude`, `origin`.`longitude` AS `origin_longitude`, `destination`.`street_address` AS `destination_streetAddress`, `destination`.`postal_code` AS `destination_postalCode`, `destination`.`city` AS `destination_city`, `destination`.`state_province` AS `destination_stateProvince`, `destination`.`country` AS `destination_country`, `destination`.`latitude` AS `destination_latitude`, `destination`.`longitude` AS `destination_longitude`, `truck`.`id` AS `truck_id`, `truck`.`model` AS `truck_model`, `truck`.`plate_number` AS `truck_plate_number`, `truck`.`conteneur_plate_number` AS `truck_conteneur_plate_number`, `truck`.`year` AS `truck_year`, `truck`.`type` AS `truck_type`, `truck`.`image_url` AS `truck_image_url`, `truck`.`width` AS `truck_width`, `truck`.`height` AS `truck_height`, `truck`.`length` AS `truck_length`, `truck`.`max_weight` AS `truck_max_weight`, `truck`.`transporterAccountId` AS `truck_transporterAccountId`, `transporterAccount`.`id` AS `transporterAccount_id`, `transporterAccount`.`name` AS `transporterAccount_name`, `transporterAccount`.`patent` AS `transporterAccount_patent`, `transporterAccount`.`patent_content_type` AS `transporterAccount_patent_content_type`, `transporterAccount`.`balance` AS `transporterAccount_balance`, `transporterAccount`.`end_of_subscription` AS `transporterAccount_end_of_subscription`, `transporterAccount`.`insurance` AS `transporterAccount_insurance`, `transporterAccount`.`insurance_content_type` AS `transporterAccount_insurance_content_type`, `transporterAccount`.`userId` AS `transporterAccount_userId`, ( SELECT avg(reputation.rate) FROM reputation WHERE reputation.toId = `user`.id ) AS `reputation_rate` FROM `trip` `trip` INNER JOIN `match` `matches` ON `matches`.`tripId`=`trip`.`id` INNER JOIN `location` `origin` ON `origin`.`id` = `trip`.`originId` INNER JOIN `location` `destination` ON `destination`.`id` = `trip`.`destinationId` INNER JOIN `client_account` `clientAccount` ON `clientAccount`.`id`=`trip`.`clientAccountId` INNER JOIN `jhi_user` `user` ON `user`.`id`=`clientAccount`.`userId` INNER JOIN `truck` `truck` ON `truck`.`id`=`matches`.`truckId` INNER JOIN `transporter_account` `transporterAccount` ON `transporterAccount`.`id`=`truck`.`transporterAccountId` LIMIT ?, ?', [pageIndex, pageSize]);
      const trips: ITripsAverage[] = [];
      let bufferTrip: Trip
      let bufferReputation: number;
      let bufferMatch: Match
      let bufferTruck: Truck;
      let bufferUser: User;
      let bufferClientAccount: ClientAccount;
      let bufferTransporter: TransporterAccount;
      let bufferOrigin: Location;
      let bufferDestination: Location;
      rawQuery.forEach(element => {
          bufferTrip= new Trip();
          bufferReputation;
          bufferMatch = new Match();
          bufferTruck = new Truck();
          bufferUser = new User();
          bufferClientAccount = new ClientAccount();
          bufferTransporter = new TransporterAccount();
          bufferDestination = new Location();
          bufferOrigin = new Location();
          Object.keys(element).forEach(key => {
              bufferTrip.id = element['trip_id'];
              bufferTrip.isFull = element['trip_is_full'];
              bufferTrip.width = element['trip_width'];
              bufferTrip.height = element['trip_height'];
              bufferTrip.length = element['trip_length'];
              bufferTrip.weight = element['trip_weight'];
              bufferTrip.marchandise = element['trip_marchandise'];
              bufferTrip.etd = element['trip_etd'];
              bufferTrip.description = element['trip_description'];
              bufferTrip.state = element['trip_state'];
              bufferTrip.eta = element['trip_eta'];
              bufferTrip.tripImg = element['trip_tripImg'];
              bufferTrip.distance = element['trip_distance'];
              bufferMatch.id = element['matches_id'];
              bufferMatch.status = element['matches_status'];
              bufferMatch.date = element['matches_date'];
              bufferMatch.conversation = element['matches_conversationId'];
              bufferMatch.truck = element['matches_truckId'];
              bufferMatch.trip = element['matches_tripId'];
              bufferTruck.id = element['truck_id'];
              bufferTruck.model = element['truck_model'];
              bufferTruck.plateNumber = element['truck_plate_number'];
              bufferTruck.conteneurPlateNumber = element['truck_conteneur_plate_number'];
              bufferTruck.year = element['truck_year'];
              bufferTruck.type = element['truck_type'];
              bufferTruck.imgUrl = element['truck_image_url'];
              bufferTruck.width = element['truck_width'];
              bufferTruck.height = element['truck_height'];
              bufferTruck.length = element['truck_length'];
              bufferTruck.maxWeight = element['truck_max_weight'];
              bufferTruck.transporterAccount = element['truck_transporterAccountId'];
              bufferTransporter.id = element['transporterAccount_id'];
              bufferTransporter.name = element['transporterAccount_name'];
              bufferTransporter.patent = element['transporterAccount_patent'];
              bufferTransporter.patentContentType = element['transporterAccount_patent_content_type'];
              bufferTransporter.insurance = element['transporterAccount_insurance'];
              bufferTransporter.user = element['transporterAccount_userId'];
              bufferOrigin.id = element['trip_originId'];
              bufferOrigin.latitude = element['origin_latitude'];
              bufferOrigin.longitude = element['origin_longitude'];
              bufferOrigin.city = element['origin_city'];
              bufferOrigin.postalCode = element['origin_postalCode'];
              bufferOrigin.stateProvince = element['origin_stateProvince'];
              bufferOrigin.streetAddress = element['origin_streetAddress'];
              bufferOrigin.country = element['origin_country'];
              bufferDestination.id = element['trip_originId'];
              bufferDestination.latitude = element['destination_latitude'];
              bufferDestination.longitude = element['destination_longitude'];
              bufferDestination.city = element['destination_city'];
              bufferDestination.postalCode = element['destination_postalCode'];
              bufferDestination.stateProvince = element['destination_stateProvince'];
              bufferDestination.streetAddress = element['destination_streetAddress'];
              bufferDestination.country = element['destination_country'];
              bufferTransporter.trucks = [];
              bufferUser.id = element['user_id'];
              bufferUser.firstName = element['user_firstName'];
              bufferUser.lastName = element['user_lastName'];
              bufferUser.imageUrl = element['user_imageUrl'];
              bufferUser.phone =  element['user_phone'];
              bufferUser.miniBio = element['user_miniBio'];
              bufferUser.verifiedEmail = Boolean(element['user_verified_email']);
              bufferReputation = Number(element['reputation_rate']);
              bufferClientAccount.id = element['trip_clientAccountId'];
              bufferClientAccount.user = bufferUser;
              bufferMatch.truck = bufferTruck;
              bufferTrip.matches = [bufferMatch];
              bufferTrip.clientAccount = bufferClientAccount;
              bufferTrip.destination = bufferDestination;
              bufferTrip.origin = bufferOrigin;
          });

          trips.push({
              trip: bufferTrip,
              averageReputation: bufferReputation
          });

      });

      return [trips, trips.length];
  }

    async calculateAverageRating(transporterIds: string[]): Promise<any[]> {
      return await this.manager.query("SELECT transporter_account.id, AVG(reputation.rate) AS avg_rating, COUNT(DISTINCT truck.id) AS total_trucks FROM transporter_account LEFT JOIN truck ON truck.transporterAccountId = transporter_account.id LEFT JOIN reputation ON transporter_account.id = reputation.toId WHERE transporter_account.id IN (?) GROUP BY transporter_account.id", [transporterIds]);
    }
}

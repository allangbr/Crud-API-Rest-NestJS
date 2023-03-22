import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { HttpService } from '@nestjs/axios/dist';
import { Data, Root } from './interfaces/get.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly httpService: HttpService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User>  {
    const newUser = new this.userModel(createUserDto);
    console.log(`Email send to ${newUser.email}`);
    return newUser.save();
  }

  async findAll() {
    const url = `https://reqres.in/api/users`;

    const { data } = await this.httpService.get<Root>(url).toPromise();
    return data.data;
  }

  async findOne(id: number) {
    const url = `https://reqres.in/api/users/${id}`;

    const { data } = await this.httpService.get<Root>(url).toPromise();
    return data.data;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: updateUserDto,
      },
      {
        new: true,
      },
    );
  }

  remove(id: string) {
    return this.userModel
      .deleteOne({
        _id: id,
      })
      .exec();
  }
}

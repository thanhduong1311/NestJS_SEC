import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';
import { Repository } from 'typeorm';
import { RoleDtoRequest } from './dto/roleDto';
import { formatDate } from 'src/utils/dateFormat';
import { HttpStatus } from 'src/global/globalEnum';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ) {}

  async findAll() {
    const roles = await this.roleRepository.find();
    return roles.filter(item => item.deleteAt == null);
  }

  public async findOne(id: number) {
    const foundInfo = await this.roleRepository.findOneBy({ id });
    if (!foundInfo || foundInfo.deleteAt != null)
      throw new HttpException('Cannot found role with id ' + id, HttpStatus.ERROR);
    return this.roleRepository.findOneBy({ id });
  }

  add(createData: RoleDtoRequest) {
    const newRole = this.roleRepository.create({
      roleName: createData.roleName,
      createAt: formatDate(new Date()),
      updateAt: formatDate(new Date()),
      deleteAt: null
    });
    return this.roleRepository.save(newRole);
  }

  async update(id: number, updateData: RoleDtoRequest) {
    const foundInfo = await this.roleRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException('Cannot found role with id ' + id, HttpStatus.ERROR);

    const newData = {
      updateAt: formatDate(new Date()),
      createAt: foundInfo.createAt,
      roleName: updateData.roleName,
      deleteAt: updateData.deleteAt
    };

    await this.roleRepository.update({ id }, newData);

    const updatedRole = await this.roleRepository.findOneBy({ id });

    return updatedRole;
  }

  async remove(id: number) {
    const foundInfo = await this.roleRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException('Cannot found role with id ' + id, HttpStatus.ERROR);

    foundInfo.deleteAt = formatDate(new Date());

    await this.roleRepository.update(
      { id },
      {
        ...foundInfo
      }
    );

    const deletedData = await this.roleRepository.findOneBy({ id });

    if (deletedData.deleteAt == null) {
      throw new HttpException('Some error occur when deleting role with id ' + id, 500);
    }

    return deletedData;
  }
}

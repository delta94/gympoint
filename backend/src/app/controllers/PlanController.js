import * as Yup from 'yup';

import Plan from '../models/Plan';
import Registration from '../models/Registration';

class PlanController {
  async index(req, res) {
    const plans = await Plan.findAll({
      attributes: ['id', 'title', 'duration', 'price'],
    });

    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .integer()
        .required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id, title, duration, price } = await Plan.create(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number().integer(),
      price: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const plan = await Plan.findByPk(req.params.plan_id);

    if (!plan) {
      return res.status(400).json({ error: 'This plan does not exists' });
    }

    await plan.update(req.body);

    return res.json({ message: 'plan updated successfully!' });
  }

  async delete(req, res) {
    const { plan_id } = req.params;

    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(400).json({ error: 'This plan does not exists' });
    }

    /**
     * Regra de negócio para verificar se o plano está em uso
     * (da erro na hora de deletar se não tiver essa verificação)
     */
    const planInUse = await Registration.findOne({
      where: {
        plan_id,
      },
    });

    if (planInUse) {
      return res.status(400).json({ error: 'This plan is already in use' });
    }

    await plan.destroy();

    return res.json({ message: 'Plan deleted successfully!' });
  }
}

export default new PlanController();

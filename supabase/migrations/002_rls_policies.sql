-- RLS Policies (users can only access their own data)
CREATE POLICY "Users can view own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own portfolios" ON public.portfolios FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own portfolios" ON public.portfolios FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own portfolios" ON public.portfolios FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own portfolios" ON public.portfolios FOR DELETE USING (auth.uid() = user_id);

-- Public portfolio viewing (for published portfolios)
CREATE POLICY "Anyone can view published portfolios" ON public.portfolios FOR SELECT USING (is_published = TRUE AND is_public = TRUE);
CREATE POLICY "Anyone can view published projects" ON public.projects FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.portfolios 
    WHERE portfolios.id = projects.portfolio_id 
    AND portfolios.is_published = TRUE 
    AND portfolios.is_public = TRUE
  )
);

CREATE POLICY "Anyone can view published experiences" ON public.experiences FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.portfolios 
    WHERE portfolios.id = experiences.portfolio_id 
    AND portfolios.is_published = TRUE 
    AND portfolios.is_public = TRUE
  )
);

CREATE POLICY "Anyone can view published skills" ON public.skills FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.portfolios 
    WHERE portfolios.id = skills.portfolio_id 
    AND portfolios.is_published = TRUE 
    AND portfolios.is_public = TRUE
  )
);

CREATE POLICY "Anyone can view published education" ON public.education FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.portfolios 
    WHERE portfolios.id = education.portfolio_id 
    AND portfolios.is_published = TRUE 
    AND portfolios.is_public = TRUE
  )
);

CREATE POLICY "Anyone can view published certifications" ON public.certifications FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.portfolios 
    WHERE portfolios.id = certifications.portfolio_id 
    AND portfolios.is_published = TRUE 
    AND portfolios.is_public = TRUE
  )
);

CREATE POLICY "Anyone can view published portfolio content" ON public.portfolio_content FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.portfolios 
    WHERE portfolios.id = portfolio_content.portfolio_id 
    AND portfolios.is_published = TRUE 
    AND portfolios.is_public = TRUE
  )
);

-- User-specific policies for other tables
CREATE POLICY "Users can view own projects" ON public.projects FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));
CREATE POLICY "Users can insert own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));
CREATE POLICY "Users can update own projects" ON public.projects FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));
CREATE POLICY "Users can delete own projects" ON public.projects FOR DELETE USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));

CREATE POLICY "Users can view own experiences" ON public.experiences FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));
CREATE POLICY "Users can insert own experiences" ON public.experiences FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));
CREATE POLICY "Users can update own experiences" ON public.experiences FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));
CREATE POLICY "Users can delete own experiences" ON public.experiences FOR DELETE USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));

CREATE POLICY "Users can view own skills" ON public.skills FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));
CREATE POLICY "Users can insert own skills" ON public.skills FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));
CREATE POLICY "Users can update own skills" ON public.skills FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));
CREATE POLICY "Users can delete own skills" ON public.skills FOR DELETE USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));

CREATE POLICY "Users can view own education" ON public.education FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));
CREATE POLICY "Users can insert own education" ON public.education FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));
CREATE POLICY "Users can update own education" ON public.education FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));
CREATE POLICY "Users can delete own education" ON public.education FOR DELETE USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));

CREATE POLICY "Users can view own certifications" ON public.certifications FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));
CREATE POLICY "Users can insert own certifications" ON public.certifications FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));
CREATE POLICY "Users can update own certifications" ON public.certifications FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));
CREATE POLICY "Users can delete own certifications" ON public.certifications FOR DELETE USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));

CREATE POLICY "Users can view own portfolio content" ON public.portfolio_content FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));
CREATE POLICY "Users can insert own portfolio content" ON public.portfolio_content FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));
CREATE POLICY "Users can update own portfolio content" ON public.portfolio_content FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));
CREATE POLICY "Users can delete own portfolio content" ON public.portfolio_content FOR DELETE USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));

CREATE POLICY "Users can view own data sources" ON public.data_sources FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own data sources" ON public.data_sources FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own data sources" ON public.data_sources FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own data sources" ON public.data_sources FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own generation jobs" ON public.generation_jobs FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));
CREATE POLICY "Users can insert own generation jobs" ON public.generation_jobs FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));
CREATE POLICY "Users can update own generation jobs" ON public.generation_jobs FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));
CREATE POLICY "Users can delete own generation jobs" ON public.generation_jobs FOR DELETE USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));

CREATE POLICY "Users can view own ATS scores" ON public.ats_scores FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));
CREATE POLICY "Users can insert own ATS scores" ON public.ats_scores FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));
CREATE POLICY "Users can update own ATS scores" ON public.ats_scores FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));
CREATE POLICY "Users can delete own ATS scores" ON public.ats_scores FOR DELETE USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));

CREATE POLICY "Users can view own analytics" ON public.portfolio_analytics FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));
CREATE POLICY "Users can insert own analytics" ON public.portfolio_analytics FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));

CREATE POLICY "Users can view own coaching sessions" ON public.coaching_sessions FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));
CREATE POLICY "Users can insert own coaching sessions" ON public.coaching_sessions FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));
CREATE POLICY "Users can update own coaching sessions" ON public.coaching_sessions FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));
CREATE POLICY "Users can delete own coaching sessions" ON public.coaching_sessions FOR DELETE USING (auth.uid() = (SELECT user_id FROM public.portfolios WHERE id = portfolio_id));

CREATE POLICY "Users can view own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own github cache" ON public.github_cache FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own github cache" ON public.github_cache FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own github cache" ON public.github_cache FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own github cache" ON public.github_cache FOR DELETE USING (auth.uid() = user_id);

-- Templates are public read-only
CREATE POLICY "Anyone can view templates" ON public.templates FOR SELECT USING (is_active = TRUE);
